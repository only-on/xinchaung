import { App } from 'vue';
import { Button, Calendar, message, Radio, Breadcrumb, Menu, Dropdown, Tag, Form, Input, Select, Table, Pagination, Spin, ConfigProvider } from 'ant-design-vue';

export default function initAntdv(app: App<Element>) {
    app.use(Button).use(Calendar).use(Radio).use(Breadcrumb).use(Menu).use(Dropdown).use(Tag).use(Form).use(Input).use(Select).use(Table).use(Pagination).use(Spin).use(ConfigProvider);
    app.config.globalProperties.$message = message;
    return app
}
