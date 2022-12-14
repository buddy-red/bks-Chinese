import * as yup from 'yup'

let configSchema = yup.object().shape({
  name: yup.string().required().label("连接名称"),
  host: yup.string().required().label("主机名"),
  port: yup.number().required().positive().integer().label("端口"),
  user: yup.string().nullable().label("用户名"),
  password: yup.string().nullable().label("密码")
})

export default {
  async config(connectionConfig) {
    try {
      const result = await configSchema.validate(connectionConfig, {abortEarly: false})
      return { result, errors: null, valid: true }
    } catch(ex) {
      return { result: null, errors: ex.errors, valid: false }
    }
  }
}
