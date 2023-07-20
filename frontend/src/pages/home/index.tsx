import { Button, Form, Input, Modal, Upload, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import axios from "axios";
import { useState } from "react";
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { getBase64 } from "@/utils";


// const { Dragger } = Upload;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const HomePage = () => {
  const [form] = Form.useForm();
  const [filePath, setFilePath] = useState('');
  const [fileName, setFileName] = useState('');
  const [compressed, setCompressed] = useState('')
  const [messageApi, contextHolder] = message.useMessage()
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const onChange = (info) => {
    const { status } = info.file;
    if (status === 'done') {
      setFilePath(info.file.response);
      setFileName(info.file.name);
      messageApi.open({ type: 'success', content: `${info.file.name} 文件上传成功` });
    } else if (status === 'error') {
      messageApi.open({ type: 'error', content: `${info.file.name} 文件上传失败` });
    }
  }

  const compress = async (values: any) => {
    const res = await axios.get('http://localhost:3005/compression', {
      params: {
        color: values.color || 256,
        level: values.level || 9,
        path: filePath
      },
      responseType: 'arraybuffer'
    });
    const blob = new Blob([res.data], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    setCompressed(url)

    messageApi.open({ type: "success", content: "压缩成功" })
  };

  const download = () => {
    const link = document.createElement('a');
    link.href = compressed;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(compressed);
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url?.substring(file.url?.lastIndexOf('/') + 1));
  };

  return <div
    className="px-[24px] py-[12px]"
  >
    {contextHolder}
    <div>
      {/* <a href="https://sharp.pixelplumbing.com/" target="_blank" rel="noreferrer">
        <img
          src="https://cdn.jsdelivr.net/gh/lovell/sharp@main/docs/image/sharp-logo.svg"
          alt="sharp"
          className="logo sharp" />
      </a> */}
      <label className="swap swap-flip text-9xl">
        {/* this hidden checkbox controls the state */}
        <input type="checkbox" />
        <div className="swap-on">😈</div>
        <div className="swap-off">😇</div>
      </label>
      <h1>Sharp Compress</h1>
    </div>
    <div className="flex">
      <Form
        {...layout}
        className="w-[500px] mt-[20px]"
        form={form}
        onFinish={compress}
      >
        <Form.Item
          label="Color number"
          name="color"
        >
          <Input placeholder="maximum number of palette entries, between 2 and 256" />
        </Form.Item>

        <Form.Item
          label="Compress level"
          name="level"
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Upload
            listType="picture-card"
            name='file'
            maxCount={1}
            action='http://localhost:3005/upload'
            accept=".gif"
            onChange={onChange}
            onPreview={handlePreview}
            onRemove={() => setCompressed('')}
          >
            <div>
              <PlusOutlined />
              <div className="mt-[8px]">上传</div>
            </div>
          </Upload>
        </Form.Item>

        <Button
          disabled={!filePath}
          className={`btn ${!filePath && "btn-disabled"} hover:bg-transparent`}
          htmlType="submit"
        >
          压缩图片文件😐
        </Button>
      </Form>
      <div>
        <div>
          <img src={compressed} />
        </div>

        <Button
          disabled={!compressed}
          className={`btn ${!compressed && "btn-disabled"} hover:bg-transparent`}
          onClick={download}
        >
          下载已压缩完成图片🤗
        </Button>
      </div>
    </div>
    <Modal
      open={previewOpen}
      title={previewTitle}
      footer={null}
      onCancel={() => setPreviewOpen(false)}
    >
      <img alt="previewImage" className="w-full" src={previewImage} />
    </Modal>
  </div >
}
export default HomePage;
