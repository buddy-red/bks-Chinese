import { GetClusterCredentialsCommand, RedshiftClient } from '@aws-sdk/client-redshift';

// The number of minutes to consider credentials expired *before* their actual expiration.
// This accounts for potential client clock drift.
const CREDENTIAL_EXPIRATION_THRESHOLD_MINUTES = 5;

export interface AWSCredentials {
    accessKeyId: string;
    secretAccessKey: string;
}

export interface ClusterCredentialConfiguration {
    awsRegion: string;
    clusterIdentifier: string;
    dbName: string;
    dbUser: string;
    dbGroup: string;
    durationSeconds: number;
}

export interface TemporaryClusterCredentials {
    dbUser: string;
    dbPassword: string;
    expiration: Date;
}

/**
 * RedshiftCredentialResolver provides the ability to use temporary cluster credentials to access
 * an Amazon Redshift cluster. 
 * 
 * See: https://docs.aws.amazon.com/redshift/latest/mgmt/generating-user-credentials.html
 */
export class RedshiftCredentialResolver {
    // This class uses a singleton pattern to maintain internal state.
    private static instance: RedshiftCredentialResolver;
    private constructor() {}
    public static getInstance(): RedshiftCredentialResolver {
        if (!RedshiftCredentialResolver.instance) {
            RedshiftCredentialResolver.instance = new RedshiftCredentialResolver();
        }
        return RedshiftCredentialResolver.instance;
    }

    private credentials: Map<string, TemporaryClusterCredentials> = new Map();

    private getCacheKey(awsCreds: AWSCredentials, config: ClusterCredentialConfiguration): string {
      return JSON.stringify({awsCreds, config});
    }

    /**
     * Determines whether credentials managed by the resolver should be refreshed.
     * 
     * @returns true if the credentials should be refreshed
     */
    private shouldRefreshCredentials(credentials: TemporaryClusterCredentials): Boolean {
        // If no credentials have been set, refresh.
        if (!credentials) {
            return true;
        }

        // Return true if the credentials have passed the cache expiration threshold period.
        const expiration = credentials.expiration.getTime();
        const now = new Date().getTime();
        return now >= expiration - (CREDENTIAL_EXPIRATION_THRESHOLD_MINUTES * 60 * 1000);
    }

    /**
     * Exchanges a set of AWS credentials and configuration for a temporary set of credentials
     * to a Redshift cluster.
     * 
     * @param awsCredentials the AWS credentials
     * @param config the credential configuration
     * @returns the temporary credentials
     */
    async getClusterCredentials(awsCredentials: AWSCredentials, config: ClusterCredentialConfiguration): Promise<TemporaryClusterCredentials> {
      // Validate that all required fields have been provided
      if (!awsCredentials.accessKeyId) {
        throw new Error('请提供用于IAM身份验证的访问密钥ID');
      }
      if (!awsCredentials.secretAccessKey) {
        throw new Error('请提供用于IAM身份验证的秘密访问密钥');
      }
      if (!config.awsRegion) {
        throw new Error('请提供用于IAM身份验证的AWS区域');
      }
      if (!config.clusterIdentifier) {
        throw new Error('请提供用于IAM身份验证的集群标识符.');
      }

      // Get any existing credentials
      const cacheKey = this.getCacheKey(awsCredentials, config);
      const credentials = this.credentials.get(cacheKey);

      // If the credentials exist and were created <= credentialCacheSeconds ago, return them
      // instead of refreshing. This prevents excessive calling to Redshift's control plane
      // when we have credentials that we know with high confidence are still valid.
      if (!this.shouldRefreshCredentials(credentials)) {
        console.log(`重新使用现有的Redshift集群凭证.`);
        return credentials;
      }

      // Construct the client
      const redshiftClient = new RedshiftClient({ 
        credentials: awsCredentials,
        region: config.awsRegion
      });

      // Get the credentials
      console.log(`调用Redshift以使用配置获取临时集群凭证 ${JSON.stringify(config)}`)
      const tempCredsResponse = await redshiftClient.send(new GetClusterCredentialsCommand({
        ClusterIdentifier: config.clusterIdentifier,
        DbName: config.dbName,
        DbUser: config.dbUser,
        DbGroups: [config.dbGroup],
        DurationSeconds: config.durationSeconds || undefined,
        AutoCreate: true
      }));
      console.log(`Redshift临时集群凭证将于 ${tempCredsResponse.Expiration!}`)

      const newCredentials = {
        dbUser: tempCredsResponse.DbUser!,
        dbPassword: tempCredsResponse.DbPassword!,
        expiration: new Date(tempCredsResponse.Expiration!)
      }
      this.credentials.set(cacheKey, newCredentials);

      return newCredentials;
    }
}