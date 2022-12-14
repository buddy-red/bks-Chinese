// Copyright (c) 2015 The SQLECTRON Team

export interface Error {
  code: string;
  name: string;
  message: string;
}

export const errors: {[code: string]: Error} = {
  CANCELED_BY_USER: {
    code: 'CANCELED_BY_USER',
    name: '已被用户取消查询',
    message: '查询被用户取消。查询进程可能还在进程列表中，但已经收到终止命令。',
  }
};

