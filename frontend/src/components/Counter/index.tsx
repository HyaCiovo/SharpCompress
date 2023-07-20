import styles from "./styles.module.less"
import { Button } from "antd"
import useStores from "@/hooks/useStores"
import { observer } from "mobx-react-lite"

const Counter = observer(() => {
  const { counter } = useStores()

  const increment = () => {
    counter.increase()
  }

  const decrement = () => {
    counter.decrease()
  }

  return <>
    <div className={styles.counter}>
      <Button onClick={decrement}>-</Button>
      <div className={styles.number}>{counter.count}</div>
      <Button onClick={increment}>+</Button>
    </div>
    <Button className={styles.resetbtn} onClick={() => counter.reset()}>Reset</Button>
  </>
})

export default Counter