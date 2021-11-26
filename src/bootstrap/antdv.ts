import {
    Button,
    DatePicker,
    Steps,
    Switch,
    Calendar,
    message,
    Radio,
    Breadcrumb,
    Menu,
    Dropdown,
    Tag,
    Form,
    Input,
    Select,
    Table,
    Pagination,
    Spin,
    ConfigProvider,
    Modal,
    Card,
    Progress,
    Tree,
    Carousel,
    Checkbox,
    Image,
    InputNumber,
    Tabs,
    Upload,
    Col,
    Row,
    Divider,
    Popconfirm,
    Tooltip,
    Transfer,
    Space,
    TimePicker,
} from 'ant-design-vue';
import { IAppManager, TFInitApp } from './project';

export const initAntdv: TFInitApp = function (appManager: IAppManager) {
    appManager.installPlugins(Button, DatePicker, Calendar, Steps, Switch, Radio, Breadcrumb, Menu, Dropdown, Tag, Form, Input, Select, Table, Pagination, Spin, ConfigProvider, Modal, Card, Progress, Tree, Carousel, Checkbox, Image, InputNumber, Tabs, Upload, Col, Row, Divider, Popconfirm, Tooltip, Transfer, Space, TimePicker)
    // https://github.com/vuejs/rfcs/pull/117
    // https://www.jianshu.com/p/408846ea7241
    // 尤大推荐通过provide来处理全局属性
    // 为了区分避免bug，app对象上的全局属性必须以$开头
    appManager.app.provide('$message', message)
    appManager.app.provide('$confirm', Modal.confirm)
    return appManager
}
