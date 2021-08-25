import { Button, Calendar, message, Radio, Breadcrumb, Menu, Dropdown, Tag, Form, Input, Select, Table, Pagination, Spin, ConfigProvider, Modal, Card, Progress, Tree, Carousel, Checkbox, Image } from 'ant-design-vue';
import { IAppManager, TFInitApp } from './project';

export const initAntdv: TFInitApp = function (appManager: IAppManager) {
    appManager.installPlugins(Button, Calendar, Radio, Breadcrumb, Menu, Dropdown, Tag, Form, Input, Select, Table, Pagination, Spin, ConfigProvider, Modal, Card, Progress, Tree, Carousel, Checkbox, Image)
    appManager.app.config.globalProperties.$message = message;
    return appManager
}
