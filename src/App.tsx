import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import './App.css'

interface Balloon {
  id: number
  x: number
  y: number
  color: string
  popped: boolean
}

interface Star {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

interface Confetti {
  id: number
  x: number
  y: number
  color: string
  rotation: number
}

function App() {
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [stars, setStars] = useState<Star[]>([])
  const [confetti, setConfetti] = useState<Confetti[]>([])
  
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])

  const colors = ['#FF6B9D', '#C44569', '#FFA07A', '#98D8C8', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#F39C12', '#E74C3C']

  useEffect(() => {
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3
    }))
    setStars(newStars)
  }, [])

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setGameComplete(false)
    setShowSecret(false)
    const newBalloons: Balloon[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      popped: false
    }))
    setBalloons(newBalloons)
  }

  const popBalloon = (id: number) => {
    setBalloons(prev => prev.map(b => 
      b.id === id ? { ...b, popped: true } : b
    ))
    setScore(prev => prev + 1)
    
    const balloon = balloons.find(b => b.id === id)
    if (balloon) {
      const newConfetti = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: balloon.x,
        y: balloon.y,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360
      }))
      setConfetti(prev => [...prev, ...newConfetti])
      setTimeout(() => {
        setConfetti(prev => prev.filter(c => !newConfetti.find(nc => nc.id === c.id)))
      }, 2000)
    }
  }

  useEffect(() => {
    if (score === 15 && gameStarted) {
      setGameComplete(true)
      setTimeout(() => setShowSecret(true), 1500)
    }
  }, [score, gameStarted])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #581c87, #9d174d, #881337)', overflowX: 'hidden' }}>
      
      {/* Stars Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            style={{
              position: 'absolute',
              background: '#fef9c3',
              borderRadius: '50%',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: star.delay
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
      >
        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -200, 0],
              x: [0, Math.random() * 150 - 75, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}

        <div style={{ textAlign: 'center', zIndex: 10, padding: '0 1rem' }}>
          <motion.div
            style={{ marginBottom: '2rem' }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1.8 }}
          >
            <motion.div
              style={{ fontSize: '6rem', marginBottom: '1.5rem' }}
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity 
              }}
            >
              🎉
            </motion.div>
          </motion.div>
          
          <motion.h2
            style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 800, color: 'white', marginBottom: '2rem', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            HAPPY BIRTHDAY
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring", duration: 1 }}
            style={{ marginBottom: '2rem' }}
          >
            <motion.h3 
              style={{
                fontSize: 'clamp(4rem, 12vw, 7rem)',
                fontWeight: 'bold',
                marginBottom: '1rem',
                background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF69B4, #DA70D6, #FFD700)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              ZAINAB
            </motion.h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '3rem' }}>
              <motion.span
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✨
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💫
              </motion.span>
              <motion.span
                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', color: '#fbcfe8', fontWeight: 300 }}
          >
            Scroll down for something special...
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ marginTop: '3rem', fontSize: '4rem', color: '#fde047' }}
          >
            ↓
          </motion.div>
        </div>
      </motion.section>

      {/* Wishes Section */}
      <section style={{ minHeight: '100vh', padding: '5rem 1.5rem', background: 'linear-gradient(to bottom, transparent, #581c87)' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 3.75rem)',
              fontWeight: 'bold',
              textAlign: 'center',
              background: 'linear-gradient(to right, #fde047, #f9a8d4, #d8b4fe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '4rem'
            }}
          >
            A Special Day for Someone Special
          </motion.h2>

          {[
            { 
              text: "Today we celebrate YOU and all the joy you bring to the world",
              icon: "🌟",
              delay: 0 
            },
            { 
              text: "Another year of amazing memories, beautiful moments, and endless possibilities",
              icon: "🎈",
              delay: 0.2 
            },
            { 
              text: "May this year bring you happiness that lasts, dreams that come true, and love that grows",
              icon: "💝",
              delay: 0.4 
            },
            { 
              text: "Here's to new adventures, wonderful surprises, and making every moment count",
              icon: "🎊",
              delay: 0.6 
            },
            {
              text: "Because someone as wonderful as you deserves the best today and always!",
              icon: "✨",
              delay: 0.8
            }
          ].map((wish, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: wish.delay, duration: 0.8 }}
              style={{ marginBottom: '3rem' }}
            >
              <motion.div 
                style={{
                  background: 'linear-gradient(to bottom right, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2))',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '1.5rem',
                  padding: 'clamp(2rem, 5vw, 3rem)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: '1.5rem' }}>
                  <motion.div 
                    style={{ fontSize: 'clamp(3rem, 6vw, 4rem)' }}
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity 
                    }}
                  >
                    {wish.icon}
                  </motion.div>
                  <p style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', color: 'white', fontWeight: 300, lineHeight: 1.6 }}>
                    {wish.text}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section style={{ minHeight: '100vh', padding: '5rem 1.5rem', background: 'linear-gradient(to bottom, #581c87, #312e81)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ maxWidth: '80rem', margin: '0 auto' }}
        >
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-3rem', left: '-3rem', fontSize: '6rem', color: 'rgba(244, 114, 182, 0.2)' }}>❝</div>
            <div style={{ position: 'absolute', bottom: '-3rem', right: '-3rem', fontSize: '6rem', color: 'rgba(244, 114, 182, 0.2)' }}>❞</div>

            <div style={{
              background: 'linear-gradient(to bottom right, rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3))',
              backdropFilter: 'blur(24px)',
              borderRadius: '1.5rem',
              padding: 'clamp(3rem, 6vw, 4rem)',
              border: '2px solid rgba(244, 114, 182, 0.4)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <motion.div
                style={{ textAlign: 'center', marginBottom: '2rem' }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎁</div>
              </motion.div>

              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <motion.p 
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: 'white', lineHeight: 1.6, fontWeight: 300 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  "Count your age by friends, not years.
                </motion.p>
                <motion.p 
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: 'white', lineHeight: 1.6, fontWeight: 300 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Count your life by smiles, not tears."
                </motion.p>
                <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(244, 114, 182, 0.3)' }}>
                  <motion.p 
                    style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', color: '#fbcfe8', lineHeight: 1.6, fontStyle: 'italic' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    May your days be filled with countless reasons to smile, Zainab! 😊
                  </motion.p>
                </div>
              </div>

              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    fontSize: '2.25rem',
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                >
                  {i % 2 === 0 ? '✨' : '💫'}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Game Section */}
      <section style={{ minHeight: '100vh', padding: '5rem 1.5rem', background: 'linear-gradient(to bottom, #312e81, #581c87)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }}>🎯</div>
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.75rem)', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
              Birthday Challenge Time!
            </h2>
            <p style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', color: '#fbcfe8', marginBottom: '0.5rem' }}>
              Pop all 15 balloons to unlock your special surprise!
            </p>
            <p style={{ fontSize: '1.125rem', color: '#fde047', fontStyle: 'italic' }}>
              (But here's the twist... there's a funny message waiting! 😄)
            </p>
          </motion.div>

          <div style={{
            background: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
            backdropFilter: 'blur(12px)',
            borderRadius: '1.5rem',
            padding: 'clamp(2rem, 5vw, 3rem)',
            border: '2px solid rgba(244, 114, 182, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {!gameStarted && !gameComplete && (
              <motion.div 
                style={{ textAlign: 'center', padding: '3rem 0' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div style={{ marginBottom: '2rem' }}>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontSize: '7rem', marginBottom: '1.5rem', display: 'inline-block' }}
                  >
                    🎈
                  </motion.div>
                  <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '42rem', margin: '0 auto 2rem' }}>
                    Ready for some birthday fun? Click start and tap those balloons as fast as you can!
                  </p>
                </div>
                <motion.button
                  onClick={startGame}
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(to right, #ec4899, #a855f7, #6366f1)',
                    color: 'white',
                    fontSize: '1.875rem',
                    fontWeight: 'bold',
                    padding: '1.5rem 4rem',
                    borderRadius: '9999px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: 'none',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    LET'S GO! 🎯
                  </span>
                </motion.button>
              </motion.div>
            )}

            {gameStarted && !gameComplete && (
              <div style={{
                position: 'relative',
                height: '600px',
                background: 'linear-gradient(to bottom, #7dd3fc, #bae6fd, #fef08a)',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
                border: '4px solid #fde047'
              }}>
                {/* Sun */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    width: '6rem',
                    height: '6rem',
                    borderRadius: '50%',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'radial-gradient(circle, #FDB813 0%, #F59E0B 100%)'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <div style={{ position: 'absolute', inset: '1rem', background: '#fef08a', borderRadius: '50%', opacity: 0.6 }} />
                </motion.div>

                {/* Clouds */}
                <motion.div
                  style={{ position: 'absolute', top: '5rem', left: '2.5rem', fontSize: '4rem' }}
                  animate={{ x: [0, 80, 0] }}
                  transition={{ duration: 15, repeat: Infinity }}
                >
                  ☁️
                </motion.div>
                <motion.div
                  style={{ position: 'absolute', top: '8rem', right: '6rem', fontSize: '3rem' }}
                  animate={{ x: [0, -60, 0] }}
                  transition={{ duration: 12, repeat: Infinity }}
                >
                  ☁️
                </motion.div>
                <motion.div
                  style={{ position: 'absolute', top: '12rem', left: '33%', fontSize: '2.5rem' }}
                  animate={{ x: [0, 50, 0] }}
                  transition={{ duration: 18, repeat: Infinity }}
                >
                  ☁️
                </motion.div>

                {/* Score Display */}
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  left: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '1rem 2rem',
                  borderRadius: '9999px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '4px solid #f472b6'
                }}>
                  <span style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#7c3aed' }}>
                    {score} / 15 🎈
                  </span>
                </div>

                {/* Confetti */}
                {confetti.map((conf) => (
                  <motion.div
                    key={conf.id}
                    style={{
                      position: 'absolute',
                      width: '12px',
                      height: '12px',
                      left: `${conf.x}%`,
                      top: `${conf.y}%`,
                      backgroundColor: conf.color,
                      transform: `rotate(${conf.rotation}deg)`
                    }}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{
                      y: [0, 100],
                      x: [0, Math.random() * 100 - 50],
                      opacity: [1, 0],
                      scale: [1, 0]
                    }}
                    transition={{ duration: 2 }}
                  />
                ))}

                {/* Balloons */}
                {balloons.map((balloon) => (
                  <AnimatePresence key={balloon.id}>
                    {!balloon.popped && (
                      <motion.div
                        style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          left: `${balloon.x}%`,
                          top: `${balloon.y}%`
                        }}
                        initial={{ scale: 0, rotate: 0, y: 100 }}
                        animate={{ 
                          scale: 1,
                          rotate: [0, 10, -10, 0],
                          y: [0, -15, 0]
                        }}
                        exit={{ 
                          scale: 0,
                          rotate: 360,
                          opacity: 0,
                          y: -50
                        }}
                        transition={{
    rotate: { repeat: Infinity, duration: 2.5 },
    y: { repeat: Infinity, duration: 2.5 }
  }}
                        onClick={() => popBalloon(balloon.id)}
                        whileHover={{ scale: 1.3, rotate: 20 }}
                        whileTap={{ scale: 0.8 }}
                      >
                        <div 
                          style={{ 
                            position: 'relative',
                            width: '5rem',
                            height: '7rem',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            backgroundColor: balloon.color,
                            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                            border: '3px solid rgba(255,255,255,0.3)'
                          }}
                        >
                          <div style={{ position: 'absolute', top: '1rem', left: '1.5rem', width: '1.75rem', height: '2.5rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '50%', filter: 'blur(4px)' }} />
                          <div style={{ position: 'absolute', bottom: '-0.75rem', left: '50%', transform: 'translateX(-50%)', width: '0.25rem', height: '3rem', background: '#374151' }} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}

                {/* Grass */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '6rem', background: 'linear-gradient(to top, #15803d, #16a34a, #22c55e)' }}>
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      style={{ position: 'absolute', bottom: '0.5rem', fontSize: '1.875rem', left: `${i * 10 + 5}%` }}
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                    >
                      {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '🌼' : '🌺'}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {gameComplete && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 1.5 }}
                style={{ textAlign: 'center', padding: '3rem 0' }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ fontSize: '7rem', marginBottom: '1.5rem', display: 'inline-block' }}
                >
                  🎊
                </motion.div>
                <h3 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
                  AMAZING! 🎉
                </h3>
                <p style={{ fontSize: '1.5rem', color: '#fbcfe8', marginBottom: '2rem' }}>
                  All balloons popped! Your surprise is ready below...
                </p>
                <motion.button
                  onClick={startGame}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    padding: '1rem 2.5rem',
                    borderRadius: '9999px',
                    border: '2px solid #f472b6',
                    cursor: 'pointer'
                  }}
                  whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 Play Again?
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Secret Funny Message Section */}
      <AnimatePresence>
        {showSecret && (
          <motion.section 
            style={{
              minHeight: '100vh',
              padding: '5rem 1.5rem',
              background: 'linear-gradient(to bottom, #881337, #9d174d, #be123c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <div style={{ position: 'absolute', inset: 0 }}>
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    fontSize: '3rem',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    y: [0, -40, 0],
                    opacity: [0.3, 0.8, 0.3],
                    rotate: [0, 180, 360],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                >
                  {i % 4 === 0 ? '🎉' : i % 4 === 1 ? '✨' : i % 4 === 2 ? '🎈' : '💫'}
                </motion.div>
              ))}
            </div>

            <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
              <motion.div
                initial={{ scale: 0, rotate: -360 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 2 }}
                style={{ marginBottom: '3rem' }}
              >
                <motion.div 
                  style={{ fontSize: '7rem', marginBottom: '2rem' }}
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  😄
                </motion.div>
                <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>
                  The Big Reveal!
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '3rem', marginBottom: '1.5rem' }}>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>🎁</motion.span>
                  <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>✨</motion.span>
                  <motion.span animate={{ rotate: -360 }} transition={{ duration: 2, repeat: Infinity }}>🎁</motion.span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                style={{
                  background: 'linear-gradient(to bottom right, rgba(251, 191, 36, 0.3), rgba(236, 72, 153, 0.3))',
                  backdropFilter: 'blur(24px)',
                  borderRadius: '1.5rem',
                  padding: 'clamp(3rem, 6vw, 4rem)',
                  border: '4px solid rgba(251, 191, 36, 0.5)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: 'absolute',
                      fontSize: '2.25rem',
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  >
                    ✨
                  </motion.div>
                ))}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 10 }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, type: "spring" }}
                    style={{ fontSize: '4rem', marginBottom: '1.5rem' }}
                  >
                    🎂
                  </motion.div>

                  <motion.p 
                    style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: 'white', lineHeight: 1.6, fontWeight: 300 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    "Congratulations! You're now officially...
                  </motion.p>
                  
                  <motion.p 
                    style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fde047', fontWeight: 'bold' }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2, type: "spring" }}
                  >
                    ONE YEAR CLOSER TO THOSE SENIOR DISCOUNTS! 😂
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    style={{ paddingTop: '2rem', borderTop: '2px solid rgba(251, 191, 36, 0.3)' }}
                  >
                    <p style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, marginBottom: '1rem' }}>
                      But seriously though...
                    </p>
                    <p style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', color: '#fbcfe8', lineHeight: 1.6, fontWeight: 300 }}>
                      Age is just a number, and you're getting better with every year!
                    </p>
                    <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', color: 'rgba(255, 255, 255, 0.8)', marginTop: '1.5rem', fontStyle: 'italic' }}>
                      Keep shining, keep smiling, and keep being the amazing person you are! ✨
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                style={{ marginTop: '3rem' }}
              >
                {[...Array(15)].map((_, i) => (
                  <motion.span
                    key={i}
                    style={{ display: 'inline-block', fontSize: '3rem', margin: '0 0.5rem' }}
                    animate={{
                      y: [0, -40, 0],
                      rotate: [0, 360, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.15
                    }}
                  >
                    {i % 3 === 0 ? '🎉' : i % 3 === 1 ? '🎊' : '🎈'}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Final Section */}
      <section style={{
        minHeight: '100vh',
        padding: '5rem 1.5rem',
        background: 'linear-gradient(to bottom, #be123c, #581c87, #000000)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              color: '#fef08a',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 15}px`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            ✨
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, type: "spring" }}
          style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}
        >
          <motion.div
            style={{ marginBottom: '3rem' }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', fontSize: '5rem', marginBottom: '1.5rem' }}>
              <motion.span
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🌟
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💫
              </motion.span>
              <motion.span
                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🌟
              </motion.span>
            </div>
          </motion.div>

          <motion.h2 
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 'bold', color: 'white', marginBottom: '2rem' }}
            animate={{
              textShadow: [
                '0 0 20px rgba(236, 72, 153, 0.5)',
                '0 0 40px rgba(236, 72, 153, 0.8)',
                '0 0 60px rgba(236, 72, 153, 1)',
                '0 0 40px rgba(236, 72, 153, 0.8)',
                '0 0 20px rgba(236, 72, 153, 0.5)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            HAPPY BIRTHDAY
          </motion.h2>
          
          <motion.h3
            style={{
              fontSize: 'clamp(4rem, 10vw, 7rem)',
              fontWeight: 800,
              marginBottom: '2.5rem',
              background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF1493, #DA70D6, #FFD700, #FFA500)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            ZAINAB
          </motion.h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', fontSize: '4rem' }}>
            <motion.span 
              animate={{ rotate: 360 }} 
              transition={{ duration: 4, repeat: Infinity }}
            >
              🌙
            </motion.span>
            <motion.span 
              animate={{ scale: [1, 1.4, 1] }} 
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <motion.span 
              animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
              transition={{ duration: 3, repeat: Infinity }}
            >
              ☪️
            </motion.span>
            <motion.span 
              animate={{ scale: [1, 1.4, 1] }} 
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              ✨
            </motion.span>
            <motion.span 
              animate={{ rotate: -360 }} 
              transition={{ duration: 4, repeat: Infinity }}
            >
              🌙
            </motion.span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <p style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: '#fde047', fontWeight: 600 }}>
              Barakallahu Feeki! 🎂
            </p>
            <p style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', color: '#fbcfe8', fontWeight: 300 }}>
              May Allah bless you today and always
            </p>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic', maxWidth: '42rem', margin: '2rem auto 0' }}>
              Wishing you a year filled with joy, success, and beautiful moments! 🌟
            </p>
          </motion.div>
          
          <motion.div
            style={{ marginTop: '4rem', fontSize: '7rem' }}
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
          >
            🎈
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{ marginTop: '4rem' }}
          >
            <p style={{ color: '#f9a8d4', fontSize: '1.5rem', fontWeight: 300, fontStyle: 'italic' }}>
              ✨ Created with love & celebration ✨
            </p>
          </motion.div>
        </motion.div>
      </section>

    </div>
  )
}

export default App