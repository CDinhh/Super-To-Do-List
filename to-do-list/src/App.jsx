import { useState, useEffect } from 'react'
import { DatePicker, Divider, message } from 'antd';
import { ClockCircleOutlined, DashboardOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import todoSlice from './app/todoSlice';


function App() {
  const musicPlaylist = {
    MTP: 'https://soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1925530323&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false',
    MCK: 'https://soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1660571346&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false',
    Obito: 'https://soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2009224335&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false',
    Tlinh: 'https://soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1685845422&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false',
    Wrxdie: 'https://soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1786869444&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false',
    HieuThu2: 'https://soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1902528475&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false',
    Youtube: 'https://www.youtube.com/embed/M1WtAPZJSlY?si=BWOJYoUUWS9t6WOB',
  }

  const tasks = useSelector(state => state.todoList);
  const [inputValue, setInputValue] = useState('');
  const [currentPlaylist, setCurrentPlaylist] = useState(musicPlaylist.MTP);
  const [clock, setClock] = useState('')
  const [messageApi, contextHolder] = message.useMessage();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showMusicSetting, setShowMusicSetting] = useState(false);
  const [targetMissionId, setTargetMissionId] = useState('');

  const dispatch = useDispatch();


  const addTask = () => {
    if (inputValue.trim() !== '') {
      dispatch(todoSlice.actions.addMission({
        id: Date.now(),
        text: inputValue,
        completed: false,
        countDown: null,
      }))
      setInputValue('');
      console.log(Date.now());
    }
  }

  const deleteTask = (id) => {
    dispatch(todoSlice.actions.deleteMission(id));
  }

  const toggleComplete = (id) => {
    dispatch(todoSlice.actions.toggleComplete(id));
  }

  const updateCountDown = (id, time) => {
    dispatch(todoSlice.actions.updateCountDown({ id, time }));
  }
  const success = () => {
    messageApi.open({
      content: 'Good Job Baby!',
      className: 'text-pink-500 font-bold',
      style: {
        marginTop: '1vh',
      },
      duration: 1,
    });
  };

  const removeCountDown = (id) => {
    dispatch(todoSlice.actions.removeCountDown(id));
  }


  const disabledTime = () => {
    const now = dayjs();
    const currentHour = now.hour();
    const currentMinute = now.minute() + 1;

    return {
      disabledHours: () => {
        // Disable hours trước giờ hiện tại
        return Array.from({ length: currentHour }, (_, i) => i);
      },
      disabledMinutes: (selectedHour) => {
        if (selectedHour === currentHour) {
          return Array.from({ length: currentMinute }, (_, i) => i);
        }
        return [];
      },
      disabledSeconds: () => {
        // Disable tất cả giây trừ 0
        return Array.from({ length: 60 }, (_, i) => i).filter(s => s !== 0);
      },
    };
  };

  const disabledDate = (current) => {
    // Disable tất cả ngày trước hôm nay
    return current && current < dayjs().startOf('day');
  };

  const toggleBg = () => {
    const bgDiv = document.querySelector('.bg-img');
    const bgImage = window.getComputedStyle(bgDiv).backgroundImage.match(/\d+/g);
    let number = Number.parseInt(bgImage[bgImage.length - 1]);
    console.log(number);
    if (number == 3) number = 1;
    else number += 1;
    bgDiv.style.backgroundImage = `url('/${number}.jpg')`;
  }


  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setClock(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {contextHolder}
      <div className=" w-screen h-screen bg-img flex relative">
        <div className="glass-border w-[35vw] m-auto h-[90vh] flex flex-col p-8">
          <h1 className="text-center text-7xl mt-6 mb-8 text-white font-bold select-none">Mission List</h1>

          {/* Input section */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add new mission baby"
              className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white selection:bg-pink-500/50"
            />
            <button
              onClick={addTask}
              className="px-6 py-3 bg-white/30 hover:bg-white/40 text-white font-semibold rounded-lg border-2 border-white/50 transition-all cursor-pointer"
            >
              Add
            </button>
          </div>
          <Divider
            dashed
            className="ant-divider"
          />
          {/* Task list */}
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-4 bg-white/20 rounded-lg border-2 border-white/30 hover:bg-white/30 transition-all"
              >
                <div
                  onClick={() => {
                    if (!task.completed) {
                      success();
                      removeCountDown(task.id);
                    }
                    toggleComplete(task.id);
                  }}
                  className={`w-6 h-6 rounded-full border-2 border-white cursor-pointer flex items-center justify-center transition-all
                    ${task.completed ? 'bg-pink-500/70' : 'bg-white/20'}`}
                >
                  {task.completed && <span className="text-white text-sm select-none">✓</span>}
                </div>
                <span className={`flex-1 text-white text-lg selection:bg-pink-500/50 ${task.completed ? 'line-through opacity-60' : ''}`}>
                  {task.text}
                </span>
                {task.countDown && (() => {
                  // task.countDown format: "YYYY-MM-DD HH:mm:ss"
                  const targetTime = dayjs(task.countDown);
                  const now = dayjs();
                  const remainSeconds = targetTime.diff(now, 'second');

                  if (remainSeconds < 0) {
                    removeCountDown(task.id);
                    return null;
                  }

                  const day = Math.floor(Math.floor(remainSeconds / 86400));
                  const hour = Math.floor((remainSeconds % 86400) / 3600);
                  const min = Math.floor((remainSeconds % 3600) / 60);
                  const sec = remainSeconds % 60;

                  return (
                    <span className="text-white/80 text-md mr-2 select-none">
                      {day === 0 ? '' : day + 'd '}
                      {hour === 0 ? '' : hour + 'h '}
                      {min === 0 ? '' : min + 'm '}
                      {sec + 's'}
                    </span>
                  )
                })()}
                {showTimePicker && (targetMissionId === task.id) && (
                  <DatePicker
                    showTime={{ format: "HH:mm" }}
                    defaultValue={dayjs()}
                    disabledDate={disabledDate}
                    disabledTime={disabledTime}
                    onChange={(timeString) => {
                      console.log('time', timeString)
                      updateCountDown(task.id, timeString);
                      setShowTimePicker(false);
                    }}

                  />

                )}
                {
                  task.countDown && (
                    <button
                      onClick={() => removeCountDown(task.id)
                      }
                      className="px-4 py-2 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-all hover:cursor-pointer"
                      title='Remove count down'
                    >
                      <MinusCircleOutlined />
                    </button>
                  )
                }
                {
                  task.countDown == null && (
                    <button
                      onClick={() => {
                        setTargetMissionId(task.id);
                        setShowTimePicker(!showTimePicker);
                      }}
                      className="px-4 py-2 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-all hover:cursor-pointer"

                    >
                      <DashboardOutlined title='Count down this one' />
                    </button>
                  )
                }
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-4 py-2 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-all hover:cursor-pointer "

                >
                  <DeleteOutlined />
                </button>
              </div>
            ))}
          </div>

          {/* Task counter */}
          <div className="mt-4 text-center text-white/80">
            {tasks.length} task{tasks.length > 1 ? 's' : ''} • {tasks.filter(t => t.completed).length} completed
          </div>
        </div>

        <div className='absolute right-10 top-10  glass-border text-white p-4 hover:cursor-pointer select-none '
          onClick={toggleBg}
          title='Maybe flick because of high res image :D'
        >
          Change Background
        </div>

        <div className={`absolute right-10 bottom-10  glass-border text-white p-4 select-none ${showMusicSetting ? '' : 'hover:cursor-pointer'}`}
          onClick={() => { setShowMusicSetting(true) }}
        >
          Give some songs
          {showMusicSetting && (
            <>
              <iframe
                className=" mt-1"
                allow="autoplay; encrypted-media"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"

                src={currentPlaylist}
              ></iframe>
              <p className='text-center'>If error occur, not my fault, SoundCloud's fault</p>
              <div className='absolute top-3 right-5 text-white'>
                <select name="chooseSinger" id="music" className='mr-5' onChange={(e) => setCurrentPlaylist(musicPlaylist[e.target.value])}>
                  {Object.keys(musicPlaylist).map(playlist => {
                    return <option key={playlist} value={playlist} className='bg-[#d68a8a]'>{playlist}</option>
                  })
                  }
                </select>
                <button
                  type='button'
                  className=' rounded-lg z-10 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMusicSetting(false);
                  }}
                >
                  X
                </button>
              </div>
            </>
          )}
        </div>

        {/* Đồng hồ góc trái */}
        <div
          className='absolute left-10 top-10  glass-border text-white p-4 hover:cursor-not-allowed select-none text-3xl'
          title='Time doesnt comeback but we can comeback to they:)'>
          <ClockCircleOutlined />  {clock}
        </div>
      </div>
    </>
  )
}
export default App
