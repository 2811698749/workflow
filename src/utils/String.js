/***
 *  @author:cuiliang 
 *  @email: cuiliang@victorysoft.com.cn|zerostyle@126.com
 *  @date：20191024
 *  @version:V1.1.0
 *  @description:
 *  该模块全局一次引入，该模块扩展了javascript中的内置类型String，
 *  软件中如有对该模块方法调用时，请将该模块在main.js中引入，即可在程序运行时就完成了对基础类型的扩展，
 *  如对此机制不明白的请查阅javascript相关文档
 *  @example:
 *  以下两种方式都会输出:该文件是String.js，其作者是崔良！
 *  "该文件是{0}，其作者是{1}！".format("String.js","崔良")
 *  "该文件是{filename}，其作者是{author}！".format({"filename":"String.js","author":"崔良"})"
 *  以下方法分别为 清除字符串两头的空格、清除字符串前面的空格、清除字符串后面的空格
 *  "   Hello,cuiliang!   ".trim();    输出："Hello,cuiliang!"
 *  "   Hello,cuiliang!   ".ltrim();   输出："Hello,cuiliang!   "
 *  "   Hello,cuiliang!   ".rtrim();   输出："   Hello,cuiliang!"
 * 
 * 
 *  @interface:
 *  String.prototype.format([]/json)
 *  String.prototype.trim()
 *  String.prototype.ltrim()
 *  String.prototype.rtrim()
 * 
 * 
 * 
 */ 




/**
 * var templateA="{0},{1}!";
 * var templateB="{wordA},{wordB}!";
 * var htmlA=templateA.format("hellp","world");
 * var htmlB=templateB.format({wordA:"hello",wordB:"world"});
 * @param {[]/json} args 
 */
String.prototype.format = function(args) {
    let result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (let key in args) {
                if(args[key]!=undefined){
                    let reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (let i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    let reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

/**
 * 去除该字符串的前后空格
 */
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
   };
/**
 * 去除该字符串前面的空格
 */
String.prototype.ltrim = function() {
    return this.replace(/(^\s*)/g, "");
    };
/**
 * 去除该字符串后面的空格
 */
String.prototype.rtrim = function() {
    return this.replace(/(\s*$)/g, "");
   };

   

export default String;