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
    Divider
} from 'ant-design-vue';
import {IAppManager, TFInitApp} from './project';

export const initAntdv: TFInitApp = function (appManager: IAppManager) {
    appManager.installPlugins(Button, DatePicker, Calendar, Steps, Switch, Radio, Breadcrumb, Menu, Dropdown, Tag, Form, Input, Select, Table, Pagination, Spin, ConfigProvider, Modal, Card, Progress, Tree, Carousel, Checkbox, Image, InputNumber, Tabs, Upload, Col, Row, Divider)
    appManager.app.config.globalProperties.$message = message;
    return appManager
}
