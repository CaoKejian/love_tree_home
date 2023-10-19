import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import Editor from '../share/Editor'
import { Switch } from 'antd'
import s from './Home.module.scss'
import { AppContext } from '../share/AppContext'
import Header from '../component/left/Header'
import Footer from '../component/left/Footer'
import Body from '../component/left/Body'
import { chatListType } from '../component/type'
import RightBody from '../component/right/RightBody'
import { Time } from '../share/Time'

interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {
  const [editorTheme, setEditorTheme] = useState('day')
  const [defaultSwitch, setDefaultSwitch] = useState<boolean>(true)
  const [next, setNext] = useState<boolean>(true) // 控制下一步

  /* 控制下一步 */
  const updateNext = (isNext: boolean) => {
    isNext && setNext(true)
    !isNext && setNext(false)
  }

  const changeTheme = (e: boolean) => {
    setDefaultSwitch(!defaultSwitch)
    localStorage.setItem('git_theme', JSON.stringify(e))
    doSomething(e)
    if (!e) {
      setEditorTheme('dark')
    } else {
      setEditorTheme('day')
    }
  }
  const { doSomething } = React.useContext(AppContext)

  /* 控制列表增添 */
  const [chatList, setChatList] = useState<chatListType[]>([])
  useEffect(() => {
    const LocalList = JSON.parse(localStorage.getItem('chatList') as string)
    if(!LocalList) return
    setChatList(LocalList)
  },[])
  useEffect(() => {
    localStorage.setItem('chatList', JSON.stringify(chatList))
  }, [chatList])

  /* 控制列表的index */
  const [curIndex, setCurIndex] = useState(0)
  const changeIndex = (index:number) => {
    setCurIndex(index)
    localStorage.setItem('chatlist_index', JSON.stringify(index))
  }
  useEffect(() => {
    setCurIndex(JSON.parse(localStorage.getItem('chatlist_index') as string))
  }, [])

  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem('git_theme') as string)
    if (!theme) {
      setDefaultSwitch(false)
      setEditorTheme('dark')
    }
  }, [defaultSwitch])
  const content = '欢迎来到小丽（机器人）的对话。让小丽来教你学习Git并开启新的旅程吧~'
  const code = 'git ( num ) => num + 1'

  const addList = (num: number) => {
    if (num === 1) {
      setChatList((p) => [
        { id: Date.now(), name: '选择一个模块', time: Time(Date.now()) },
        ...p,
      ])
    } else {
      setChatList((p) => [
        { id: Date.now(), name: 'git之旅', time: Time(Date.now()) },
        ...p,
      ])
    }
  }
  return (<div className={s.wrapper}>
    <div className={s.switch}>
      <span>主题</span>
      <Switch
        className={s.switchModal}
        checkedChildren={<svg className={s.svgDay}><use xlinkHref='#day'></use></svg>}
        unCheckedChildren={<svg className={s.svgDark}><use xlinkHref='#dark'></use></svg>}
        checked={defaultSwitch}
        onClick={(e) => changeTheme(e)}
      />
    </div>
    <div className={s.editor}>
      <div className={s.left}>
        <Header />
        <Body chatList={chatList} curIndex={curIndex} changeIndex={changeIndex}/>
        <Footer addList={addList} />
      </div>
      <div className={s.right}>
        <div className={s.right_top}>
          <RightBody content={content} code={code} updateNext={updateNext}/>
        </div>
        <div className={s.right_bottom}>
          <Editor editorTheme={editorTheme} next={next} updateNext={updateNext}/>
        </div>
      </div>
    </div>
  </div>
  )
}

export default memo(Home)