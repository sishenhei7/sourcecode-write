# 小型组件库

> 里面没有什么组件，主要是为了学习如何开发一个 vue 组件库，仿照[art-ui](https://github.com/art-design-ui/art-ui)实现。

## 主要功能

- [ ] 支持umd cjs es 模块引入
- [ ] 支持ts,导出类型声明
- [ ] 支持storybook文档
- [ ] 支持commit规范检测
- [ ] 支持预提交检查代码规范eslint stylelint
- [ ] 支持autoprefixer
- [ ] 支持单元测试
- [ ] 支持自动化构建、自动生成ChangeLog
- [ ] 支持主题色自定义
- [ ] 支持按需加载

## 提交规范

```javascript
yarn run gc
```

- feat：新功能（feature）`
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动

## 标准发布流程

- 版本更新
- 生成 CHANGELOG
- 推送至 git 仓库
- 组件库打包
- 发布至 yarn
- 打 tag 并推送至 git

## 参考资料

1. [Ant Design](https://ant.design/docs/spec/proximity-cn) 开发原则
2. 多人协作[git -flow工作流](https://www.git-tower.com/learn/git/ebook/cn/command-line/advanced-topics/git-flow)
