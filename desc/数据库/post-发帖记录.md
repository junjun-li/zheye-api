| 字段    | 类型     | 空  | 默认  | 注释                                                                                          |
| :------ | :------- | :-- | ----- | --------------------------------------------------------------------------------------------- |
| tid     | ObjectId | 否  |       | 这个默认产生的 ObjectId(‘’),取的时候需要\_id                                                  |
| uid     | String   | 否  |       | 用户 ID                                                                                       |
| title   | String   | 否  |       | 文章标题                                                                                      |
| content | String   | 否  |       | 文章内容                                                                                      |
| created | Date     | 否  | now() | 创建时间时间                                                                                  |
| catalog | String   | 否  |       | 帖子分类，index-全部，ask-提问, advise-建议, discuss-交流, share-分享, logs-动态, notice-公告 |
| fav     | String   | 否  |       | 帖子积分                                                                                      |
| isEnd   | String   | 否  | 0     | 0-未结束，1-已结贴                                                                            |
| reads   | Number   | 否  | 0     | 阅读记数                                                                                      |
| answer  | Number   | 否  | 0     | 回答记数                                                                                      |
| status  | String   | 否  | 0     | 0-打开回复，1-关闭回复                                                                        |
| isTop   | String   | 否  | 0     | 0-未置顶，1-已置顶                                                                            |
| sort    | String   | 否  | 0     | 置顶排序                                                                                      |
| tags    | Array    | 否  |       | 文章的标签, 精华，加精, etc                                                                   |
