# 使用Node.js的官方Docker镜像
FROM node:16
 
# 设置工作目录
WORKDIR /home/pmp-admin-koa
 
# 复制package.json文件和package-lock.json文件
COPY package*.json ./
 
# 安装项目依赖
RUN npm install
 
# 复制所有源代码到工作目录
COPY . .
 
# 绑定3100端口
EXPOSE 3100
 
# 启动Koa2应用
CMD ["node", "./bin/www"]