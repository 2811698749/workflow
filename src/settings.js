module.exports = {
  title: 'Element UI Admin - 示例项目',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   * 子系统ID
   */
  // auth 服务地址
  oauthDoMain: 'http://192.168.1.106:8899',
  // 获取token
  oauthAddr: 'http://192.168.1.106:8899/oauth/authorize',
  clientId: process.env.VUE_APP_ClIENT_ID,
  clientSecret: process.env.VUE_APP_ClIENT_SECRET,
  redirectUri: process.env.VUE_APP_ClIENT_REDIRECTURI,
  //网关地址
  gateWayUrl: 'http://192.168.1.106:9001'
}
