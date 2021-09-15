import { Button,DatePicker, Calendar, message, Radio, Breadcrumb, Menu, Dropdown, Tag, Form, Input, Select, Table, Pagination, Spin, ConfigProvider, Modal, Card, Progress, Tree, Carousel, Checkbox, Image, InputNumber,Tabs,Upload, Col, Row } from 'ant-design-vue';
import { IAppManager, TFInitApp } from './project';

export const initAntdv: TFInitApp = function (appManager: IAppManager) {
    appManager.installPlugins(Button, DatePicker,Calendar, Radio, Breadcrumb, Menu, Dropdown, Tag, Form, Input, Select, Table, Pagination, Spin, ConfigProvider, Modal, Card, Progress, Tree, Carousel, Checkbox, Image, InputNumber,Tabs,Upload, Col, Row)
    appManager.app.config.globalProperties.$message = message;
    return appManager
}
