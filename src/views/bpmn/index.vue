<template>
  <div class="flow-container">
    <div ref="content" class="containers">
      <div ref="canvas" class="canvas" />
      <div id="js-properties-panel" class="panel" />
      <ul class="buttons">
        <li style="display: none">
          <a ref="saveDiagram" href="javascript:" title="download BPMN diagram">BPMN diagram</a>
        </li>
        <li>
          <a ref="saveSvg" href="javascript:" title="download as SVG image">SVG image</a>
        </li>
        <li>
          <a class="active" href="javascript:" @click="saveBpmn">查看XML</a>
        </li>
        <li>
          <a class="active" href="javascript:" @click="showImport">导入XML</a>
        </li>
      </ul>
    </div>
    <el-dialog :visible.sync="xmlVisible" title="XML" :fullscreen="false" top="10vh" width="80%">
      <vue-ace-editor
        v-model="activitiXml"
        lang="xml"
        theme="chrome"
        width="100%"
        height="400"
        :options="{wrap: false}"
        @init="editorInit"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="xmlVisible = false">关 闭</el-button>
        <el-button v-show="importVisible" type="success" @click="importXML">导 入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入相关的依赖
import BpmnViewer from 'bpmn-js'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import VueAceEditor from 'vue2-ace-editor'
import customTranslate from './customTranslate'

export default {
  name: 'FlowBpmn',
  components: {
    VueAceEditor
  },
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlStr: null,
      activitiXml: null,
      xmlVisible: false,
      importVisible: false,
      processName: ''
    }
  },
  mounted() {
    // 获取到属性ref为“content”的dom节点
    this.container = this.$refs.content
    // 获取到属性ref为“canvas”的dom节点
    const canvas = this.$refs.canvas

    // 汉化
    var customTranslateModule = {
      translate: ['value', customTranslate]
    }

    // 建模，官方文档这里讲的很详细
    this.bpmnModeler = new BpmnModeler({
      container: canvas,
      // 添加控制板
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      additionalModules: [
        // 左边工具栏以及节点
        propertiesProviderModule,
        // 右边的工具栏
        propertiesPanelModule,
        // 汉化
        customTranslateModule
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    })

    // 下载画图
    const _this = this
    // 获取a标签dom节点
    const downloadLink = this.$refs.saveDiagram
    const downloadSvgLink = this.$refs.saveSvg
    // 给图绑定事件，当图有发生改变就会触发这个事件
    this.bpmnModeler.on('commandStack.changed', function() {
      _this.saveSVG(function(err, svg) {
        _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
      })

      _this.saveDiagram(function(err, xml) {
        _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
      })
    })

    this.createNewDiagram(this.bpmnModeler)
  },
  methods: {
    createNewDiagram() {
      const bpmnXML = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                    '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                    'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                    'xmlns:tns="http://www.activiti.org/bpmn" ' +
                    'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
                    'id="m1568796216967" name="" ' +
                    'targetNamespace="http://www.activiti.org/bpmn">\n' +
                    '  <process id="Process_1" name="" isExecutable="true" />' +
                    '  <bpmndi:BPMNDiagram id="Diagram-_1" name="New Diagram" documentation="background=#FFFFFF;count=1;horizontalcount=1;orientation=0;width=842.4;height=1195.2;imageableWidth=832.4;imageableHeight=1185.2;imageableX=5.0;imageableY=5.0">\n' +
                    '    <bpmndi:BPMNPlane bpmnElement="myProcess_1" />\n' +
                    '  </bpmndi:BPMNDiagram>\n' +
                    '</definitions>'
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(bpmnXML, function(err) {
        if (err) {
          console.error(err)
        } else {
          // 这里还没用到这个，先注释掉吧
          // that.success()
        }
      })
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveSVG(done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      this.bpmnModeler.saveSVG(done)
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml)
      })
    },
    // camunda替换activiti
    formatXML(data) {
      var temp = data.replace(/camunda/ig, 'activiti')
      temp = temp.replace(/FormField/ig, 'formProperty')
      temp = temp.replace('http://activiti.org/schema/1.0/bpmn', 'http://activiti.org/bpmn')
      return temp
    },
    // 反向替换，activiti替换camunda
    reformatXML(data) {
      let temp = data.replace('http://activiti.org/bpmn', 'http://activiti.org/schema/1.0/bpmn')
      temp = temp.replace(/activiti/ig, 'camunda')
      temp = temp.replace(/formProperty/ig, 'FormField')
      return temp
    },
    saveBpmn() {
      if (!this.xmlStr) {
        this.$message({
          type: 'error',
          message: '流程为空'
        })
        return
      }
      const xml = this.formatXML(this.xmlStr)
      if (xml.indexOf('startEvent') == -1) {
        this.$message({
          type: 'error',
          message: '必须要有开始按钮'
        })
        return
      }
      if (xml.indexOf('endEvent') == -1) {
        this.$message({
          type: 'error',
          message: '必须要有结束按钮'
        })
        return
      }
      this.xmlVisible = true
      this.importVisible = false
      this.activitiXml = xml
    },
    showImport() {
      this.xmlVisible = true
      this.importVisible = true
      this.activitiXml = ''
    },
    importXML() {
      if (!this.activitiXml) {
        this.$message({
          type: 'error',
          message: '导入xml不能为空'
        })
        return
      }
      this.xmlStr = this.reformatXML(this.activitiXml)
      const _this = this
      this.bpmnModeler.importXML(this.xmlStr, function(err) {
        if (err) {
          console.error(err)
          _this.$message({
            type: 'error',
            message: '导入失败'
          })
        } else {
          _this.xmlVisible = false
        }
      })
    },
    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded(link, name, data) {
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)
      // 获取到图的xml，保存就是把这个xml提交给后台
      this.xmlStr = data
      // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
      if (data) {
        link.className = 'active'
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        link.download = name
      }
    },
    editorInit() {
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/xml') // language
      require('brace/theme/chrome')
    }
  }
}
</script>

<style lang="less">

/*左边工具栏以及编辑节点的样式*/
  @import '~bpmn-js/dist/assets/diagram-js.css' ;
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  .flow-container {
    display: flex;
}
/*右边工具栏样式*/
  @import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
  .containers{
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    top:-10px;
    z-index: 9;
  }
  .canvas{
    width: 100%;
    height: 100%;
  }
  .panel{
    position: absolute;
    right: 0;
    top: 0;
    width: 300px;
    height:100%;
    overflow-y:scroll;
  }
  .buttons{
    position: absolute;
    left: 20px;
    bottom: 20px;
    &>li{
      display:inline-block;margin: 5px;
      &>a{
        color: #999;
        background: #eee;
        cursor: not-allowed;
        padding: 8px;
        border: 1px solid #ccc;
        &.active{
          color: #333;
          background: #fff;
          cursor: pointer;
        }
      }
    }
  }
</style>
