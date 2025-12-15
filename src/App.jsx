import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { DatePicker, Divider, message, Slider, Switch } from 'antd';
import { ClockCircleOutlined, DashboardOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import todoSlice from './app/todoSlice';

// Move static data outside component to prevent recreation on every render
const musicPlaylist = {
  Youtube: {
    Noel: 'https://www.youtube.com/embed/M1WtAPZJSlY?si=BWOJYoUUWS9t6WOB',
    Windy: 'https://www.youtube.com/embed/ttEEpPrIzkU?si=vEJ31OUwSEPXrYxl',
  },
  SoundCloud: {
    MTP: 'https://soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1925530323&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false',
    MCK: 'https://soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1660571346&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false',
    Obito: 'https://soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2009224335&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false',
    Tlinh: 'https://soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1685845422&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false',
    Wrxdie: 'https://soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1786869444&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false',
    HTH: 'https://soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1902528475&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false',
  },
};

// Memoized TaskItem component to prevent unnecessary re-renders
const TaskItem = memo(({
  task,
  toggleComplete,
  deleteTask,
  removeCountDown,
  success,
  showTimePicker,
  targetMissionId,
  setTargetMissionId,
  setShowTimePicker,
  updateCountDown,
  disabledDate,
  disabledTime
}) => {
  const handleToggleComplete = useCallback(() => {
    if (!task.completed) {
      success();
      removeCountDown(task.id);
    }
    toggleComplete(task.id);
  }, [task.completed, task.id, success, removeCountDown, toggleComplete]);

  const handleDelete = useCallback(() => {
    deleteTask(task.id);
  }, [task.id, deleteTask]);

  const handleRemoveCountDown = useCallback(() => {
    removeCountDown(task.id);
  }, [task.id, removeCountDown]);

  const handleShowTimePicker = useCallback(() => {
    setTargetMissionId(task.id);
    setShowTimePicker(prev => !prev);
  }, [task.id, setTargetMissionId, setShowTimePicker]);

  const handleDateChange = useCallback((timeString) => {
    updateCountDown(task.id, timeString.format('YYYY-MM-DD HH:mm:ss'));
    setShowTimePicker(false);
  }, [task.id, updateCountDown, setShowTimePicker]);

  return (
    <div
      className="flex items-center justify-between gap-3 p-4 bg-white/20 rounded-lg border-2 border-white/30 hover:bg-white/30 transition-all max-[640px]:p-2 max-[640px]:gap-2"
    >
      <div className='flex 2xl:ml-5 '>
        <div
          onClick={handleToggleComplete}
          className={` w-6 h-6 rounded-full border-2 border-white cursor-pointer flex items-center justify-center transition-all
          ${task.completed ? 'bg-pink-500/70' : 'bg-white/20'}`}
        >
          {task.completed && <span className="text-white text-sm select-none">✓</span>}
        </div>
        <div className={` ml-2 2xl:ml-5 max-w-[20vw] max-[1690px]:w-[15vw] max-[768px]:max-w-[50vw] max-[640px]:max-w-[55vw] max-[640px]:text-sm wrap-break-word text-white text-lg selection:bg-pink-500/50 ${task.completed ? 'line-through opacity-60' : ''}`}>
          {task.text}
        </div>
      </div>

      <div className='flex flex-col text-end'>
        {task.countDown && !task.completed && (() => {
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

        <div >
          {task.countDown && !task.completed && (
            <button
              onClick={handleRemoveCountDown}
              className="mr-2 px-4 py-2 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-all hover:cursor-pointer"
              title='Remove count down'
            >
              <MinusCircleOutlined />
            </button>
          )}
          {task.countDown == null && !task.completed && (
            <button
              onClick={handleShowTimePicker}
              className="mr-2 px-4 py-2 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-all hover:cursor-pointer"
            >
              <DashboardOutlined title='Count down this one' />
            </button>
          )}
          <button
            onClick={handleDelete}
            className=" px-4 py-2 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-all hover:cursor-pointer "
          >
            <DeleteOutlined />
          </button>
        </div>

        {showTimePicker && (targetMissionId === task.id) && (
          <div className='mt-2'>
            <DatePicker
              open={showTimePicker}
              showTime={{ format: "HH:mm ", showSecond: false }}
              format="YYYY-MM-DD HH:mm"
              disabledDate={disabledDate}
              disabledTime={disabledTime}
              onChange={handleDateChange}
              renderExtraFooter={() => <div className='flex justify-around items-center h-10'>
                <p>Choose your deadline cuhh</p>
              </div>}
              minuteStep={5}
              changeOnScroll
              showNow={false}
              needConfirm={true}
            />
          </div>
        )}
      </div>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';

function App() {

  const [inputValue, setInputValue] = useState('');
  const [clock, setClock] = useState('')
  const [messageApi, contextHolder] = message.useMessage();
  const [showOpacitySlider, setShowOpacitySlider] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [targetMissionId, setTargetMissionId] = useState('');



  const [currentPlatForm, setCurrentPlatForm] = useState(() => {
    const value = JSON.parse(localStorage.getItem('current-platform'));
    return value ? value : 'Youtube'
  })

  const [currentSong, setCurrentSong] = useState(() => {
    const value = JSON.parse(localStorage.getItem('current-song'));
    return value ? value : 'Noel'
  })

  const [currentPlaylist, setCurrentPlaylist] = useState(() => {
    if (currentSong && currentPlatForm) {
      return musicPlaylist[currentPlatForm][currentSong];
    } else {
      return musicPlaylist.Youtube.Noel;
    }
  });

  const [showMusicSetting, setShowMusicSetting] = useState(() => {
    const value = JSON.parse(localStorage.getItem('show-music-secsion'));
    return value
  });


  const [textLine, setTextLine] = useState(() => {
    const value = JSON.parse(localStorage.getItem('show-text-line'));
    return value
  });
  const [opacityValue, setOpacityValue] = useState(() => {
    const value = localStorage.getItem('opacity-value');
    return value ? Number(value) : 50
  });


  const tasks = useSelector(state => state.todoList);
  const dispatch = useDispatch();



  useEffect(() => {
    localStorage.setItem('CDMissionList', JSON.stringify(tasks));
  }, [tasks])


  const addTask = useCallback(() => {
    if (inputValue.trim() !== '') {
      dispatch(todoSlice.actions.addMission({
        id: Number.parseInt(Date.now()),
        text: inputValue,
        completed: false,
        countDown: null,
      }))
      setInputValue('');
    }
  }, [inputValue, dispatch])

  const deleteTask = useCallback((id) => {
    dispatch(todoSlice.actions.deleteMission(id));
  }, [dispatch])

  const toggleComplete = useCallback((id) => {
    dispatch(todoSlice.actions.toggleComplete(id));
  }, [dispatch])

  const updateCountDown = useCallback((id, time) => {
    dispatch(todoSlice.actions.updateCountDown({ id, time }));
  }, [dispatch])

  const success = useCallback(() => {
    messageApi.open({
      content: 'Good Job Baby!',
      className: 'text-pink-500 font-bold',
      style: {
        marginTop: '1vh',
      },
      duration: 1,
    });
  }, [messageApi]);

  const removeCountDown = useCallback((id) => {
    dispatch(todoSlice.actions.removeCountDown(id));
  }, [dispatch])


  const disabledTime = useCallback(() => {
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
  }, []);

  const disabledDate = useCallback((current) => {
    // Disable tất cả ngày trước hôm nay
    return current && current < dayjs().startOf('day');
  }, []);

  const toggleBg = useCallback(() => {
    const bgDiv = document.querySelector('.bg-img');
    const bgImage = window.getComputedStyle(bgDiv).backgroundImage.match(/\d+/g);
    let number = Number.parseInt(bgImage[bgImage.length - 1]);
    if (number == 3) number = 1;
    else number += 1;
    bgDiv.style.backgroundImage = `url('/${number}.jpg')`;
  }, [])


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

  useEffect(() => {
    const newValue = 10 * opacityValue / 100;

    document.documentElement.style.setProperty('--glass-blur', `${newValue}rem`);
  }, [opacityValue]);

  useEffect(() => {
    if (textLine)
      document.documentElement.style.setProperty('--text-shadow1', '-1px -1px 0 #000,1px -1px 0 #000,-1px  1px 0 #000,1px  1px 0 #000');
    else
      document.documentElement.style.setProperty('--text-shadow1', '0');

  }, [textLine])

  useEffect(() => {
    localStorage.setItem('current-platform', JSON.stringify(currentPlatForm));
    localStorage.setItem('current-song', JSON.stringify(currentSong));
  }, [currentPlatForm, currentPlaylist])

  // Memoize sorted tasks to prevent re-sorting on every render
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => b.id - a.id);
  }, [tasks]);

  // Memoize completed count
  const completedCount = useMemo(() => {
    return tasks.filter(t => t.completed).length;
  }, [tasks]);

  // Memoized handlers for better performance
  const handleInputChange = useCallback((e) => setInputValue(e.target.value), []);

  const handleInputKeyPress = useCallback((e) => {
    if (e.key === 'Enter') addTask();
  }, [addTask]);

  const handleMusicSettingShow = useCallback(() => {
    setShowMusicSetting(true);
    localStorage.setItem('show-music-secsion', JSON.stringify(true));
  }, []);

  const handleMusicSettingHide = useCallback((e) => {
    e.stopPropagation();
    setShowMusicSetting(false);
    localStorage.setItem('show-music-secsion', JSON.stringify(false));
  }, []);

  const handleOpacityChange = useCallback((value) => {
    setOpacityValue(value);
    localStorage.setItem('opacity-value', JSON.stringify(value));
  }, []);

  const handleTextLineChange = useCallback((e) => {
    setTextLine(e);
    localStorage.setItem('show-text-line', JSON.stringify(e));
  }, []);

  return (
    <>
      {contextHolder}
      <div className=" w-screen h-screen bg-img flex relative">

        {/* Mission block */}
        <div className="glass-border w-[35vw] m-auto h-[90vh] flex flex-col p-8 max-[1350px]:w-[40vw]  max-[1280px]:w-[50vw] max-[1024px]:w-[50vw] max-[768px]:w-[95vw] max-[768px]:h-[85vh] max-[768px]:p-4">
          <h1 className="text-center text-7xl mt-6 mb-8 text-white font-bold select-none max-[768px]:text-4xl max-[768px]:mt-3 max-[768px]:mb-4">Mission List</h1>

          {/* Input section */}
          <div className="flex gap-3 mb-6 max-[640px]:gap-2 max-[640px]:mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleInputKeyPress}
              placeholder="Add new mission baby"
              className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white selection:bg-pink-500/50 max-[640px]:px-2 max-[640px]:py-2 max-[640px]:text-sm"
              maxLength={30}
            />
            <div
              onClick={addTask}
              className="px-6 py-3 bg-white/30 hover:bg-white/40 text-white font-semibold rounded-lg border-2 border-white/50 transition-all cursor-pointer max-[640px]:px-4 max-[640px]:py-2 max-[640px]:text-sm"
            >
              Add
            </div>
          </div>
          <Divider
            dashed
            className="ant-divider"
          />
          {/* Task block */}
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {sortedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                toggleComplete={toggleComplete}
                deleteTask={deleteTask}
                removeCountDown={removeCountDown}
                success={success}
                showTimePicker={showTimePicker}
                targetMissionId={targetMissionId}
                setTargetMissionId={setTargetMissionId}
                setShowTimePicker={setShowTimePicker}
                updateCountDown={updateCountDown}
                disabledDate={disabledDate}
                disabledTime={disabledTime}
              />
            ))}
          </div>
          {/* Task block */}

          {/* Task counter */}
          <div className="mt-4 text-center text-white/80">
            {tasks.length} task{tasks.length > 1 ? 's' : ''} • {completedCount} completed
          </div>
          {/* Task counter */}

        </div>
        {/* Mission block */}


        <div className='absolute right-10 top-10 glass-border text-white p-4 hover:cursor-pointer select-none z-30 max-[900px]:hidden'
          onClick={toggleBg}
          title='Maybe flick because of high res image :D'
        >
          Change Background
        </div>

        <div className={`  absolute right-10 bottom-10 max-[1280px]:static max-[1280px]:mx-auto max-[1280px]:mt-4 max-[1280px]:mb-6 max-[1280px]:w-[50vw] max-[1024px]:w-[50vw] max-[768px]:w-[95vw] max-[768px]:p-2 glass-border text-white p-4 select-none  ${showMusicSetting ? '' : 'hover:cursor-pointer'}`}
          onClick={handleMusicSettingShow}
        >
          Music section
          {showMusicSetting && (
            <>
              <iframe
                className='2xl:w-[20vw] 2xl:h-[30vh]  mt-1 mx-auto '
                allow="autoplay; encrypted-media"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"

                src={currentPlaylist}
              ></iframe>
              <p className='text-center mt-2 text-sm max-[768px]:text-xs px-2 wrap-break-word'>If error occur, not my fault, SoundCloud's fault</p>
              <div className='absolute top-3 right-5 flex flex-nowrap'>
                <select name="chooseSinger" id="music" className='mr-5 border rounded text-center' onChange={(e) => {
                  const selectedOption = e.target.options[e.target.selectedIndex];
                  const platform = selectedOption.parentElement.label;
                  const song = selectedOption.value;
                  setCurrentPlatForm(platform);
                  setCurrentSong(song);
                  setCurrentPlaylist(musicPlaylist[platform][song]);

                }}>
                  {Object.keys(musicPlaylist).map(platform => {
                    return <optgroup key={platform} label={platform} className='bg-[#e98080]'>
                      {Object.keys(musicPlaylist[platform]).map(song => {
                        return <option
                          key={song}
                          value={song}
                          selected={currentPlaylist === musicPlaylist[platform][song]}
                          className='bg-[#da9b9b] text-start hover:bg-[#e98080]'
                        >
                          {song}
                        </option>
                      })}
                    </optgroup>
                  })
                  }
                </select>
                <div
                  // type='button'
                  className='rounded-lg z-10 cursor-pointer'
                  onClick={handleMusicSettingHide}
                >
                  X
                </div>
              </div>
            </>
          )}
        </div>

        {/* Clock At Left Conner */}
        <div
          className='absolute left-10 top-10 glass-border text-white p-4 hover:cursor-not-allowed select-none text-3xl max-[900px]:hidden'
          title='Time doesnt comeback but we can comeback to they:)'>
          <ClockCircleOutlined />
          {clock}
        </div>

        {/* Slider at the right conner */}
        <div className="absolute top-30 right-10 glass-border text-white  p-4 max-[900px]:hidden">
          <span onClick={() => setShowOpacitySlider(true)} className={`${showOpacitySlider ? 'mr-4' : 'cursor-pointer'} `}>Glass opacity</span>
          <span onClick={() => setShowOpacitySlider(false)} className={`${showOpacitySlider ? 'cursor-pointer' : 'hidden'}`} >X</span>
          {showOpacitySlider && (
            <>
              <div>
                <Slider horizontal min={30} value={opacityValue} onChange={handleOpacityChange} />
              </div>
              <div className='flex gap-1 text-center items-center'>
                <p>Text line</p>
                <Switch
                  checked={textLine}
                  size="small"
                  checkedChildren="on"
                  unCheckedChildren="off"
                  onChange={handleTextLineChange}
                />
              </div>
            </>
          )}
        </div>

      </div >
    </>
  )
}
export default App
