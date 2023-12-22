import { InputNumber, message } from "antd"
import { encode, decode, add, hello } from "./constants/release.js"
import { useEffect, useState } from "react"
import _throttle from "lodash/throttle.js"
// import _debounce from "lodash/debounce.js"

const Wasm = () => {
  const [input1, setInput1] = useState<number>(1)
  const [input2, setInput2] = useState<number>(1)
  const [input3, setInput3] = useState<string>()
  const [input4, setInput4] = useState<string>()
  const [outputEncode, setEncode] = useState<string>()
  const [outputDecode, setDecode] = useState<string>()
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (hello)
      console.log("connect wasm successfully")
    else
      console.error("something was wrong with wasm")
  }, [])

  const onHello = _throttle(() => {
    messageApi.info(hello());
  }, 1000)

  const encodeData = _throttle(() => {
    if (!input3)
      return messageApi.warning("Data can't be empty")
    const data = encode(input3)
    setEncode(data)
  }, 1000)

  const decodeData = _throttle(() => {
    if (!input4)
      return messageApi.warning("Data can't be empty")
    const data = decode(input4)
    setDecode(data)
  }, 1000)


  return <div className="w-[100vw] overflow-hidden">
    {contextHolder}
    <h1>Wasm Page</h1>
    <div className="mt-8">
      <InputNumber className="w-[100px] mr-4" defaultValue={input1} onChange={e => setInput1(e)} />
      +
      <InputNumber className="w-[100px] mx-4" defaultValue={input2} onChange={e => setInput2(e)} />
      =
      <span className="ml-4">{add(input1, input2)}</span>
    </div>
    <div className="mt-8">
      <button onClick={onHello} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">Hello WASM</button>
    </div>

    <div className="mt-8 flex flex-col w-full lg:flex-row">
      <div className="grid flex-grow h-32 card bg-white rounded-box place-items-center max-w-full justify-center items-center">
        To Encode
        <input onChange={e => setInput3(e.target.value)} type="text" placeholder="Type here"
          className="input input-sm input-bordered input-primary w-full max-w-xs" />
        <button className="btn btn-xs" onClick={encodeData}>Get Output</button>
        <div className="w-full">output: {outputEncode}</div>
      </div>
      <div className="divider lg:divider-horizontal">OR</div>
      <div className="grid flex-grow h-32 card bg-white rounded-box place-items-center max-w-full">
        To Decode
        <input onChange={e => setInput4(e.target.value)} type="text" placeholder="Type here"
          className="input input-sm input-bordered input-primary w-full max-w-xs" />
        <button className="btn btn-xs" onClick={decodeData}>Get Output</button>
        <div className="w-full">output: {outputDecode}</div>
      </div>
    </div>
  </div>
}

export default Wasm