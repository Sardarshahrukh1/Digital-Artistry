import { useState } from "react";
import { Typography, Input, Button, Modal, Form, Select, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ShopOutlined,
  CloseCircleOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  PlusCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

import { uploadListingAndFetchUrl } from "../../functions/uploadListing";
import { addNewListing } from "../../functions/marketplace";
const { Search } = Input;

//state buildin react object.use to contain data or information for component

const { Title } = Typography;

const MarketPlaceSidebar = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [activePage, setActivePage] = useState("browse");
  const { user } = useSelector((state) => ({ ...state }));

  const [listing, setListing] = useState({
    type: "art",
  });

  //modal component for creating dialogs

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSearch = (value, event, info) => {};

  const onClickNavItem = (link) => {
    setActivePage(link);
    navigate("/marketplace/" + link);
  };

  const onFinish = (values) => {
    handleUpload(values);
  };

  const onFinishFailed = (errorInfo) => {};

  const handleListingType = (value) => {
    setListing({
      ...listing,
      type: value,
    });
  };

  //props stands for properties.props are passed to components via html attributes

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: async (file) => {
      const preview = await getBase64(file);
      console.log(preview);
      setPreviewImage(preview);
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onHandlePreview = async (file) => {
    const preview = await getBase64(file.originFileObj);
    setPreviewImage(preview);
  };

  const onDeletePreview = () => {
    setFileList([]);
    setPreviewImage("");
  };

  const generateId = () => {
    return (
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36)
    );
  };

  const handleUpload = async (values) => {
    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("image", file);
      });
      setUploading(true);
      const data = await uploadListingAndFetchUrl(formData, user.token);

      if (data && data.payload) {
        setFileList([]);
        const newList = await addNewListing(
          user.token,
          values.title,
          values.price,
          values.description,
          data.payload,
          user.id,
          listing.type,
          generateId()
        );

        if (newList && newList.code === 201) {
          console.log("New Item added");
        }
      }
      setUploading(false);
      setIsModalOpen(false);
    } catch (error) {
      setUploading(false);
      setIsModalOpen(false);
    }
  };
  return (
    <div className="pt-20 content sider-container">
      <Title level={2}>Marketplace</Title>
      <ul className="menu">
        <li
          className={activePage === "" ? "custom-active" : ""}
          onClick={() => onClickNavItem("")}
        >
          <span className="iconBox">
            {/* <ShopOutlined /> */}
            <img src="../../../left/marketplace-lft.png" />
          </span>
          <span level={6} className="title">
            Browse All
          </span>
        </li>
        <li
          className={activePage === "notification" ? "custom-active" : ""}
          onClick={() => onClickNavItem("notification")}
        >
          <span className="iconBox">
            {/* <BellOutlined /> */}
            <img src="../../../left/notification.png" />
          </span>
          <span level={6} className="title">
            Notifications
          </span>
        </li>
        <li
          className={activePage === "buying" ? "custom-active" : ""}
          onClick={() => onClickNavItem("buying")}
        >
          <span className="iconBox">
            {/* <ShoppingCartOutlined /> */}
            <img src="../../../left/buy.png" />
          </span>
          <span level={8} className="title">
            Buying
          </span>
        </li>
        <li
          className={activePage === "selling" ? "custom-active" : ""}
          onClick={() => onClickNavItem("selling")}
        >
          <span className="iconBox">
            {/* <TagOutlined /> */}
            <img src="../../../left/sell.png" />
          </span>
          <span level={6} className="title">
            Selling
          </span>
        </li>
      </ul>

      <div className="actions">
        <Button
          type="primary"
          icon={<PlusCircleFilled />}
          size="large"
          onClick={showModal}
        >
          Create New Listing
        </Button>
      </div>
      <Modal
        title="Create new listing"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="Listing Type" name="listingType">
            <Select
              defaultValue={listing.type}
              onChange={handleListingType}
              options={[
                {
                  value: "art",
                  label: "3D Art",
                },
                {
                  value: "graphicdesign",
                  label: "Graphic Design",
                },
                {
                  value: "illustration",
                  label: "Illustration",
                },
                {
                  value: "painting",
                  label: "Painting",
                },
                {
                  value: "sketch",
                  label: "Sketch",
                },
                {
                  value: "digital",
                  label: "Digital Art",
                },
                {
                  value: "photoshop",
                  label: "Photoshop",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input your title!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: "Please input your price!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>

          <Form.Item className="adjust-upload">
            <Upload {...props} onPreview={onHandlePreview}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          {previewImage ? (
            <div className="preview">
              <div className="preview-body">
                <span className="delete-icon" onClick={onDeletePreview}>
                  <CloseCircleOutlined />
                </span>
                <img src={previewImage} />
              </div>
            </div>
          ) : (
            <span></span>
          )}

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button
              className="btn-at-rgt"
              type="primary"
              htmlType="submit"
              loading={uploading}
            >
              Create New Listing
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MarketPlaceSidebar;
