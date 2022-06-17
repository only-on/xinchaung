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
  Rate,
  Collapse,
} from "ant-design-vue";
message.config({
  duration: 2,
});
import { IAppManager, TFInitApp } from "./project";
import { createVNode } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
export const initAntdv: TFInitApp = function (appManager: IAppManager) {
  appManager.installPlugins(
    Collapse,
    Button,
    DatePicker,
    Calendar,
    Steps,
    Switch,
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
    Rate
  );
  // https://github.com/vuejs/rfcs/pull/117
  // https://www.jianshu.com/p/408846ea7241
  // 尤大推荐通过provide来处理全局属性
  // 为了区分避免bug，app对象上的全局属性必须以$开头
  appManager.app.config.unwrapInjectedRef = true
  appManager.app.provide("$message", message);
  const confirm = Modal.confirm;
  appManager.app.provide("$confirm", Modal.confirm);
  return appManager;
};
