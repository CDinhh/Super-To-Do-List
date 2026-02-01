import { useState, useEffect, useMemo, useCallback } from 'react'
import { DatePicker, Divider, message, Popconfirm, Slider, Switch, Tooltip } from 'antd';
import { ClockCircleFilled, ClockCircleOutlined, ClockCircleTwoTone, DashboardFilled, DashboardOutlined, DashboardTwoTone, DeleteFilled, DeleteOutlined, DeleteTwoTone, GithubFilled, GithubOutlined, MinusCircleFilled, MinusCircleOutlined, MinusCircleTwoTone, QuestionCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import todoSlice from './app/todoSlice';

const musicPlaylist = {
  Youtube: {
    Noel: 'https://www.youtube.com/embed/M1WtAPZJSlY?si=BWOJYoUUWS9t6WOB',
    Windy: 'https://www.youtube.com/embed/ttEEpPrIzkU?si=vEJ31OUwSEPXrYxl',
    LofiGirl: 'https://www.youtube.com/embed/jfKfPfyJRdk?si=CXMeMhRLkyVskqBi',
    "Cry For Me": 'https://www.youtube.com/embed/72hp9Bqfpz4?si=CQAao3Q31pqq6LTC',
    "Cry After Sẽ": 'https://www.youtube.com/embed/AmXdpVnJwt8?si=iYNuo7c1uUUxmcwG',
  },
  SoundCloud: {
    MTP: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1823574432&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=false',
    MCK: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1383951169&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=false',
    Obito: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2009224335&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=false',
    Tlinh: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1685845422&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false',
    Wrxdie: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1786869444&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false',
    HTH: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1932591619&color=%23d68a8a&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false',
  },
};

function App() {

  const [inputValue, setInputValue] = useState('');
  const [clock, setClock] = useState('')
  const [messageApi, contextHolder] = message.useMessage();
  const [showOpacitySlider, setShowOpacitySlider] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [targetMissionId, setTargetMissionId] = useState('');
  const [hideMusicSection, setHideMusicSecion] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilterButton, setShowFilterButton] = useState(false);
  const [showBgSelector, setShowBgSelector] = useState(false);
  const [currentBgImage, setCurrentBgImage] = useState(() => {
    const bgDiv = document.querySelector('.bg-img');
    if (bgDiv) {
      const bgImage = window.getComputedStyle(bgDiv).backgroundImage.match(/\d+/g);
      return bgImage ? Number.parseInt(bgImage[bgImage.length - 1]) : 1;
    }
    return 1;
  });



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
    if (!selectedDate) return;
    const now = dayjs();

    // Chỉ disable time nếu chọn ngày hôm nay
    if (!selectedDate.isSame(now, "day")) return;

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
  }, [selectedDate]);

  const disabledDate = useCallback((current) => {
    // Disable tất cả ngày trước hôm nay
    return current && current < dayjs().startOf('day');
  }, []);

  const changeBg = useCallback((number) => {
    const bgDiv = document.querySelector('.bg-img');
    const overlay = document.querySelector('.bg-overlay');

    // Fade to black
    overlay.style.opacity = '1';

    // Preload ảnh mới trước
    const img = new Image();
    img.src = `/${number}.jpg`;

    img.onload = () => {
      // Đợi fade to black hoàn tất
      setTimeout(() => {
        bgDiv.style.backgroundImage = `url('/${number}.jpg')`;
        setCurrentBgImage(number);
        // Đợi một chút để đảm bảo browser đã render xong
        setTimeout(() => {
          overlay.style.opacity = '0';
        }, 50);
      }, 600);
    };
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

  // Memoize filtered tasks based on filter state
  const filteredTasks = useMemo(() => {
    if (filter === 'done') {
      return sortedTasks.filter(task => task.completed);
    } else if (filter === 'todo') {
      return sortedTasks.filter(task => !task.completed);
    }
    return sortedTasks; // 'all'
  }, [sortedTasks, filter]);

  // Memoize completed count
  const completedCount = useMemo(() => {
    return tasks.filter(t => t.completed).length;
  }, [tasks]);

  // Memoized input handlers
  const handleInputChange = useCallback((e) => setInputValue(e.target.value), []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') addTask();
  }, [addTask]);

  return (
    <>
      {contextHolder}
      <p className="
        md:hidden
        fixed bottom-0 left-0 w-full
        bg-black/70 text-white text-center text-sm
        py-2
        z-50
      ">
        Change to PC or laptop for better experience
      </p>

      <div className="w-screen h-screen bg-img flex relative animate-fade-in">
        {/* Black overlay for smooth transition */}
        <div className="bg-overlay absolute inset-0 bg-black pointer-events-none" style={{ opacity: 0, transition: 'opacity 0.6s ease-in-out' }}></div>

        {/* Mission block */}
        <div className="relative glass-border w-[35vw] m-auto h-[90vh] flex flex-col p-8 max-[1350px]:w-[40vw]  max-[1280px]:w-[50vw] max-[1024px]:w-[50vw] max-[768px]:w-[95vw] max-[768px]:h-[85vh] max-[768px]:p-4 animate-slide-up">
          <h1 className="text-center text-7xl mt-6 mb-8 text-white font-bold select-none max-[768px]:text-4xl max-[768px]:mt-3 max-[768px]:mb-4 animate-bounce-in">Mission List</h1>

          {/* Input section */}
          <div className="flex gap-3 mb-6 max-[640px]:gap-2 max-[640px]:mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Add new mission baby"
              className="hover:scale-101 flex-1 min-w-0 px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white selection:bg-pink-500/50 max-[640px]:px-2 max-[640px]:py-2 max-[640px]:text-sm"
              maxLength={30}
            />
            <Tooltip title={inputValue ? "U can do this ;)" : 'Add new one baby ;)'}>
              <div
                onClick={addTask}
                className="hover:scale-110 px-6 py-3 bg-white/30 hover:bg-white/40 text-white font-semibold rounded-lg border-2 border-white/50 transition-all cursor-pointer max-[640px]:px-4 max-[640px]:py-2 max-[640px]:text-sm"
              >
                Add
              </div>
            </Tooltip>
          </div>

          <Divider
            dashed
            className="ant-divider"
          />
          {/* Task block */}
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {filteredTasks.map(task => (

              // Task line
              <div
                key={task.id}
                className="flex items-center justify-between gap-3 p-4 bg-white/20 rounded-lg border-2 border-white/30 hover:bg-white/30 transition-all max-[640px]:p-2 max-[640px]:gap-2 animate-fade-in-up"
              >

                <div className='flex 2xl:ml-5 '>
                  <div
                    onClick={() => {
                      if (!task.completed) {
                        success();
                        removeCountDown(task.id);
                      }
                      toggleComplete(task.id);
                    }}
                    className={` w-6 h-6 rounded-full border-2 border-white cursor-pointer flex items-center justify-center transition-all
                    ${task.completed ? 'bg-pink-500/70' : 'bg-white/20'}`}
                  >
                    {task.completed && <span className="text-white text-sm select-none">✓</span>}
                  </div>
                  <div className={` ml-2 2xl:ml-5 max-w-[20vw] max-[1690px]:w-[15vw] max-[768px]:max-w-[50vw] max-[640px]:max-w-[55vw] max-[640px]:text-sm wrap-break-word text-white text-lg selection:bg-pink-500/50 ${task.completed ? 'line-through opacity-60' : ''}`}>
                    {task.text}
                  </div>
                </div>



                {/*  Setting block */}
                <div className='flex flex-col text-end'>
                  {task.countDown && !task.completed && (() => {
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

                  {/* Button div of the middle of setting block: Delete deadline; Set deadline; Delete Task */}
                  <div >
                    {
                      task.countDown && !task.completed && (
                        <Tooltip title='Remove deadline'>
                          <button
                            onClick={() => removeCountDown(task.id)
                            }
                            className="hover:scale-110 mr-2 px-4 py-2 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-all hover:cursor-pointer"

                          >
                            <MinusCircleOutlined
                              style={{ color: 'gray' }}
                            />
                          </button>
                        </Tooltip>
                      )
                    }
                    {
                      task.countDown == null && !task.completed && (
                        <Tooltip title='Set deadline'>
                          <button
                            onClick={() => {
                              setTargetMissionId(task.id);
                              setShowTimePicker(!showTimePicker);
                            }}
                            className="hover:scale-110 mr-2 px-4 py-2 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-all hover:cursor-pointer"

                          >
                            <DashboardOutlined
                              twoToneColor="#ff7ab8b3"
                            />
                          </button>
                        </Tooltip>
                      )
                    }
                    <Tooltip title='Delete this one' >
                      <Popconfirm
                        description="Are you SURE TO DELETE this task?"
                        okText='Delete it'
                        cancelText='No'
                        onConfirm={() => deleteTask(task.id)}
                        icon={<QuestionCircleOutlined style={{ color: '#d68a8a' }} />}
                      >
                        <button

                          className="hover:scale-110 px-4 py-2 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-all hover:cursor-pointer "

                        >
                          <DeleteOutlined
                            twoToneColor="#ff7ab8b3"
                          />
                        </button>
                      </Popconfirm>
                    </Tooltip>
                  </div>
                  {/* Button div of the middle of setting block*/}

                  {/* Date Picker of the bottom of setting block*/}
                  {showTimePicker && (targetMissionId === task.id) && (
                    <div className='mt-2'>
                      <DatePicker
                        defaultValue={dayjs()}
                        open={showTimePicker}
                        onOpenChange={(open) => {
                          setShowTimePicker(open);
                        }}
                        showTime={{ format: "HH:mm ", showSecond: false }}
                        format="YYYY-MM-DD HH:mm"
                        disabledDate={disabledDate}
                        disabledTime={disabledTime}
                        onCalendarChange={(date) => {
                          console.log(date);
                          setSelectedDate(date)
                        }}
                        onChange={(timeString) => {
                          updateCountDown(task.id, timeString.format('YYYY-MM-DD HH:mm:ss'));
                          setShowTimePicker(false);
                        }}
                        renderExtraFooter={() => <div className='flex justify-around items-center h-10'>
                          <p>Choose your deadline cuhh</p>
                        </div>
                        }
                        minuteStep={5}
                        changeOnScroll
                        showNow={false}
                        needConfirm={true}

                      />
                    </div>
                  )}
                  {/* Date Picker of the bottom of setting block */}

                </div>
                {/*  Setting block */}


              </div>
              //  Task line

            ))}
          </div>
          {/* Task block */}

          {/* Filter buttons */}
          <div className={`${showFilterButton ? '' : 'hidden'} flex gap-2 mt-4 mb-3 justify-center max-[640px]:gap-1`}>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all max-[640px]:px-3 max-[640px]:py-1.5 max-[640px]:text-sm ${filter === 'all'
                ? 'bg-pink-500/80 text-white border-2 border-white'
                : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('todo')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all max-[640px]:px-3 max-[640px]:py-1.5 max-[640px]:text-sm ${filter === 'todo'
                ? 'bg-pink-500/80 text-white border-2 border-white'
                : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30'
                }`}
            >
              Doing
            </button>
            <button
              onClick={() => setFilter('done')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all max-[640px]:px-3 max-[640px]:py-1.5 max-[640px]:text-sm ${filter === 'done'
                ? 'bg-pink-500/80 text-white border-2 border-white'
                : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30'
                }`}
            >
              Done
            </button>
          </div>

          {/* Task counter */}
          <div className={`${showFilterButton ? 'hidden' : ''} mt-2 text-center text-white/80`}>
            {tasks.length} task{tasks.length > 1 ? 's' : ''} • {completedCount} completed
          </div>
          {/* Task counter */}

          <div className='absolute left-2 bottom-2'>
            <Switch
              checked={showFilterButton}
              size="small"
              checkedChildren="filter on"
              unCheckedChildren="filter off"
              onChange={(e) => {
                // toggleTextline(e);
                setShowFilterButton(e)
              }}
            />
          </div>

        </div>
        {/* Mission block */}


        {/* Right side controls container - transparent wrapper */}
        <div className='animate-slide-right absolute right-10 top-10 flex flex-col items-end gap-4 max-[900px]:hidden z-30'>

          {/* Change Background Section */}
          <div className={`${showBgSelector ? '' : 'hover:scale-110'} glass-border text-white p-4 select-none transition-all`}>
            <div className='flex justify-between items-center'>
              <Tooltip title={showBgSelector ? '' : 'Choose your favorite background'}>
                <h1
                  onClick={() => setShowBgSelector(true)}
                  className={`${showBgSelector ? '' : 'cursor-pointer'} animate-bounce-in`}
                >
                  Change Background
                </h1>
              </Tooltip>
              {showBgSelector && (
                <Tooltip title="Close this section">
                  <span
                    className='ml-4 cursor-pointer'
                    onClick={() => setShowBgSelector(false)}
                  >
                    X
                  </span>
                </Tooltip>
              )}
            </div>
            {showBgSelector && (
              <div className='grid grid-cols-3 gap-2 mt-3'>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <Tooltip key={num} title={`Background ${num}`}>
                    <div
                      onClick={() => changeBg(num)}
                      className={`relative w-20 h-20 rounded-lg cursor-pointer overflow-hidden border-2 transition-all hover:scale-105 ${currentBgImage === num ? 'border-pink-500 ring-2 ring-pink-500' : 'border-white/30 hover:border-white/60'
                        }`}
                    >
                      <img
                        src={`/${num}.jpg`}
                        alt={`Background ${num}`}
                        className='w-full h-full object-cover'
                      />
                      {currentBgImage === num && (
                        <div className='absolute inset-0 bg-pink-500/20 flex items-center justify-center'>
                          <span className='text-white text-2xl font-bold'>✓</span>
                        </div>
                      )}
                    </div>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>

          {/* Glass Opacity Section */}
          <div className={`${showOpacitySlider ? '' : 'hover:scale-110'} glass-border text-white p-4 transition-all w-fit`}>
            <div className='flex'>
              <Tooltip title={showOpacitySlider ? '' : "made something naked"}>
                <h1 onClick={() => setShowOpacitySlider(true)} className={`${showOpacitySlider ? 'mr-4' : 'cursor-pointer'} animate-bounce-in`}>Glass opacity</h1>
              </Tooltip>
              <Tooltip title="Close this section">
                <span onClick={() => setShowOpacitySlider(false)} className={`${showOpacitySlider ? 'cursor-pointer' : 'hidden'}`} >X</span>
              </Tooltip>
            </div>
            {showOpacitySlider && (
              <>
                <div>
                  <Slider horizontal min={0} value={opacityValue} onChange={(value) => {
                    setOpacityValue(value);
                    localStorage.setItem('opacity-value', JSON.stringify(value))
                  }} />
                </div>
                <div className='flex gap-1 text-center items-center'>
                  <p>Text line</p>
                  <Switch
                    checked={textLine}
                    size="small"
                    checkedChildren="on"
                    unCheckedChildren="off"
                    onChange={(e) => {
                      // toggleTextline(e);
                      setTextLine(e);
                      localStorage.setItem('show-text-line', JSON.stringify(e));
                    }}
                  />
                </div>
              </>
            )}
          </div>

        </div>

        <div className={` animate-slide-up absolute right-10 bottom-10 max-[1280px]:static max-[1280px]:mx-auto max-[1280px]:mt-4 max-[1280px]:mb-6 max-[1280px]:w-[50vw] max-[1024px]:w-[50vw] max-[768px]:w-[95vw] max-[768px]:p-2 glass-border text-white p-4 select-none  ${showMusicSetting ? '' : 'cursor-pointer'} ${hideMusicSection ? 'cursor-pointer' : ''}`}
          onClick={() => {
            if (hideMusicSection === true) setHideMusicSecion(false)
            else {
              setShowMusicSetting(true);
              localStorage.setItem('show-music-secsion', JSON.stringify(true));
            }
          }}
        >
          <Tooltip title={(showMusicSetting) ? ((hideMusicSection) ? 'Click X to turn of music' : '') : "Play some sóngs"}>
            <h1 className='animate-bounce-in'>Music section</h1>
          </Tooltip>
          {showMusicSetting && (
            <>
              <iframe
                className={`  mt-1 mx-auto ${hideMusicSection ? 'hidden' : ''} ${currentPlatForm === 'SoundCloud' ? 'h-[50vh]' : 'h-[30vh]'}`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"

                src={currentPlaylist}
              ></iframe>
              {currentPlatForm === 'SoundCloud' && !hideMusicSection && (
                <p className='text-center mt-2 text-sm max-[768px]:text-xs px-2 wrap-break-word'>SoundCloud could be error</p>
              )}
              <div className={`absolute top-3 right-5 flex flex-nowrap ${hideMusicSection ? 'hidden' : ''}`}>
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
                <Tooltip title="Hide this section">
                  <span
                    className={`mr-5 rounded-lg z-10 cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHideMusicSecion(true);
                      // localStorage.setItem('show-music-secsion', JSON.stringify(false));
                    }}
                  >
                    -
                  </span>
                </Tooltip>
                <Tooltip title="Close this section">
                  <span
                    className={`rounded-lg z-10 cursor-pointer `}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMusicSetting(false);
                      localStorage.setItem('show-music-secsion', JSON.stringify(false));
                    }}
                  >
                    X
                  </span>
                </Tooltip>
              </div>
            </>
          )}
        </div>

        {/* Clock At Left Conner */}
        <Tooltip title="Time doesnt comeback but we can comeback to them:)">
          <div
            className='flex animate-slide-left absolute left-10 top-10 glass-border text-white p-4 hover:cursor-not-allowed select-none text-3xl max-[900px]:hidden '>
            <ClockCircleFilled
              className='animate-bounce-in'
            />
            <h1 className='animate-bounce-in ml-2'>{clock}</h1>
          </div>
        </Tooltip>
        <Tooltip title="Open my repo">
          <div className=' absolute md:left-3 md:bottom-3 max-md:top-0 max-md:right-0 z-50'>
            <button className='bg-[#d68a8a] size-7 border-0 rounded-full hover:cursor-pointer'
              onClick={() => {
                window.open("https://github.com/CDinhh/Supper-To-Do-List", "_blank");
              }}
            >
              <GithubFilled
                style={{ color: 'white' }}
              />
            </button>
          </div>
        </Tooltip>

      </div >
    </>
  )
}
export default App
