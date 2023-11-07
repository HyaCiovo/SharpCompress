import { Button, Form, Image, Input, InputNumber, Modal, Upload, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import axios from "axios";
import { useState } from "react";
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { getBase64 } from "@/utils";
import classNames from "classnames"
import styles from "./styles.module.less"

const HomePage = () => {
  const [form] = Form.useForm();
  const [uploadedFile, setUploaded] = useState<UploadFile>()
  const [compressed, setCompressed] = useState({ url: '', size: 0 })
  const [messageApi, contextHolder] = message.useMessage()
  const [previewOpen, setPreviewOpen] = useState(false);
  const [comparing, setCompare] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 12 },
  };

  const onChange = async (info) => {
    const file = info.fileList[0]
    if (file) {
      const { status, name } = file;
      if (status === 'done') {
        console.log(file)
        setUploaded(file)
        messageApi.open({ type: 'success', content: `${name} 文件上传成功` });
      } else if (status === 'error') {
        messageApi.open({ type: 'error', content: `${name} 文件上传失败` });
      }
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }
      setPreviewImage(file.url || (file.preview as string));
      setPreviewTitle(file.name || file.url?.substring(file.url?.lastIndexOf('/') + 1));
    } else
      setUploaded(file)
  }

  const compress = async (values: any) => {
    const res = await axios.get('http://localhost:3005/compression', {
      params: {
        color: values.color,
        level: values.level,
        path: uploadedFile.response
      },
      responseType: 'arraybuffer'
    });
    const blob = new Blob([res.data], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    setCompressed({ url, size: blob.size })
    messageApi.success("压缩成功")
    if (blob.size > uploadedFile.size)
      messageApi.warning("生成的文件大于原文件，请调整写入参数重新压缩")
  };

  const compare = () => {
    setCompare(true)
  }

  const download = () => {
    const link = document.createElement('a');
    link.href = compressed.url;
    link.download = "sharpCompress_" + uploadedFile.name;
    link.click();
    URL.revokeObjectURL(compressed.url);
  }

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  return <div
    className="px-[24px] py-[12px]"
  >
    {contextHolder}
    <div>
      <label className={classNames(styles.flip, "swap swap-flip text-9xl")}>
        {/* this hidden checkbox controls the state */}
        <input type="checkbox" />
        <div className="swap-on">😈</div>
        <div className="swap-off">😇</div>
      </label>
      <h1>Sharp Compress</h1>
    </div>
    <div className="flex justify-around mt-[10px]">
      <Form
        {...layout}
        className="w-[500px] mt-[20px]"
        form={form}
        onFinish={compress}
        initialValues={{ color: 64, level: 6 }}
      >
        <Form.Item
          label="颜色数量（2~256）"
          name="color"
          required
        >
          <InputNumber min={2} max={256} />
        </Form.Item>

        <Form.Item
          label="压缩等级（1~9）"
          name="level"
          required
        >
          <InputNumber min={1} max={9} />
        </Form.Item>

        <Form.Item
          label="Gif图片"
          required
        >
          <Upload
            listType="picture-card"
            name='file'
            maxCount={1}
            action='http://localhost:3005/upload'
            accept=".gif"
            onChange={onChange}
            onPreview={handlePreview}
            onRemove={() => setCompressed({ url: '', size: 0 })}
          >
            <div>
              <PlusOutlined />
              <div className="mt-[8px]">上传</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item className="ml-[220px]">
          <Button
            disabled={!uploadedFile?.response}
            className={`btn ${!uploadedFile?.response && "btn-disabled"} hover:bg-transparent`}
            htmlType="submit"
          >
            压缩图片文件😋
          </Button>
        </Form.Item>
      </Form>
      <div className="flex flex-col w-[600px] items-center mt-[20px]">
        <div className="w-[580px] h-[300px] bg-[#fff] border-dashed rounded px-[10px] py-[8px] flex justify-center items-center">
          {!compressed?.url && <p>请点击压缩图片按钮</p>}
          <Image src={compressed?.url} className="max-h-[284px] max-x-[560px]" />
        </div>
        <div className="mt-[20px] grid grid-cols-2 gap-[1em]">
          <Button
            disabled={!compressed?.url}
            className={`btn ${!compressed?.url && "btn-disabled"} inline hover:bg-transparent`}
            onClick={compare}>
            图片信息对比🤓
          </Button>
          <Button
            disabled={!compressed?.url}
            className={`btn ${!compressed?.url && "btn-disabled"} inline hover:bg-transparent`}
            onClick={download}
          >
            下载已压缩完成图片🤗
          </Button>
        </div>
      </div>
    </div>
    <Image
      width={200}
      style={{ display: 'none' }}
      src={previewImage}
      preview={{
        visible: previewOpen,
        src: previewImage,
        onVisibleChange: (value) => {
          setPreviewOpen(value);
        },
      }}
    />
    <Modal
      open={comparing}
      title="压缩图片与原图片信息对比"
      footer={null}
      onCancel={() => setCompare(false)}
    >
      <div className="flex justify-between">
        <div className="max-w-[300px]">
          <p className="font-bold">{previewTitle}</p>
          <div className="flex-col max-w-full">
            <img src={uploadedFile?.preview} className="max-w-full rounded-lg shadow-2xl" alt="previewImage" />
            <div>
              <p className="py-6">Size: {(uploadedFile?.size / 1024 / 1024).toFixed(2)}M</p>
            </div>
          </div>
        </div>
        <div className="max-w-[300px]">
          <div className="flex-col max-w-full">
            <p className="font-bold">{"sharpCompress_" + previewTitle}</p>
            <img
              src={compressed?.url}
              className="max-w-[200px] max-h-[120px] rounded-lg shadow-2xl"
              alt="previewImage" />
            <div>
              <p className="py-6">Size: {(compressed?.size / 1024 / 1024).toFixed(2)}M</p>
            </div>
          </div>
        </div>
      </div>
      {compressed?.size > uploadedFile?.size && <>生成的文件大小大于原文件，请调整颜色数量和压缩等级大小</>}
    </Modal>
  </div >
}
export default HomePage;
