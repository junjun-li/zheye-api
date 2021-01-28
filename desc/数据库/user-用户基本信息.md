|   字段    |   类型   | 空  | 默认  |                               注释                                |
| :-------: | :------: | :-: | :---: | :---------------------------------------------------------------: |
|    uid    | ObjectId | 否  |       |           这个默认产生的 ObjectId(‘’),取的时候需要\_id            |
| username  |  String  | 否  |       |                      用户名，这个是邮件账号                       |
| password  |  String  | 否  |       |                               密码                                |
|   name    |  String  | 否  |       |                               昵称                                |
|  created  |   Date   | 否  | now() |                             注册时间                              |
|  updated  |   Date   | 否  | now() |                             更新时间                              |
| integral  |  Number  | 否  |  100  |                             用户积分                              |
|  gender   |  String  | 否  |       |                         默认，0-男， 1-女                         |
|   roles   |  Array   | 否  | user  |     角色, user-普通用户，admin-管理员, super_admin 超级管理员     |
|    pic    |  String  | 否  |       |                            用户的头像                             |
|  mobile   |  String  | 否  |       |                             手机号码                              |
|  status   |  String  | 否  |   0   |              是否被禁用，0-正常，1-禁言，2-账号禁用               |
| signature |  String  | 否  |       |                             个性签名                              |
| location  |  String  | 否  |       |                               城市                                |
|   isVip   |  String  | 否  |   0   | 是否是 Vip 用户， 0-普通用户，1-会员用户，2-7 定义成 vip 的 level |
|   count   |  Number  | 否  |   0   |                             签到次数                              |
