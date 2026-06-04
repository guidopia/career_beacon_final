import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Chip,
  Stack,
  Container
} from '@mui/material';
import {
  School,
  Psychology,
  TrendingUp,
  EmojiEvents,
  AutoAwesome,
  Rocket,
  AccountBalance,
  WorkspacePremium,
  Timer,
  Verified,
  ArrowForward,
  Code,
  Science,
  Brush,
  BusinessCenter
} from '@mui/icons-material';

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleGetStarted = () => {
    window.location.href = '/login';
  };

  // Animated grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gridSize = 50;
      const time = Date.now() * 0.0005;
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Animated dots at intersections
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const pulse = Math.sin(x * 0.01 + y * 0.01 + time) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(255, 255, 255, ${pulse * 0.2})`;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const statsCards = [
    { icon: <School />, label: 'AI Career Mapping', count: '10K+', color: '#60A5FA' },
    { icon: <Psychology />, label: 'Personality Tests', count: '5K+', color: '#C084FC' },
    { icon: <TrendingUp />, label: 'Success Rate', count: '95%', color: '#34D399' },
    { icon: <EmojiEvents />, label: 'Top Rated', count: '4.9★', color: '#FBBF24' },
    { icon: <WorkspacePremium />, label: 'Certified', count: '100%', color: '#F87171' },
    { icon: <Rocket />, label: 'Fast Results', count: '5min', color: '#818CF8' },
  ];

  const floatingIcons = [
    { Icon: Code, delay: 0, color: '#60A5FA', top: '8%', right: '15%' },
    { Icon: Science, delay: 0.5, color: '#34D399', top: '30%', right: '5%' },
    { Icon: Brush, delay: 1, color: '#F87171', top: '65%', right: '12%' },
    { Icon: BusinessCenter, delay: 1.5, color: '#FBBF24', top: '85%', right: '8%' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: { xs: 'auto', lg: '100vh' },
        bgcolor: '#000',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 12, sm: 14, md: 16, lg: 10 },
        pb: { xs: 8, lg: 0 },
      }}
    >
      {/* Animated Grid Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* Mouse Following Gradient */}
      <Box
        sx={{
          position: 'fixed',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          left: `${mousePos.x - 300}px`,
          top: `${mousePos.y - 300}px`,
          transition: 'all 0.3s ease-out',
          pointerEvents: 'none',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      {/* Static Gradients */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(192,132,252,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'pulse-glow 4s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', alignItems: 'center', px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' }, 
          gap: { xs: 6, md: 8, lg: 8 }, 
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          px: { lg: 4 },
        }}>
          
          {/* LEFT SIDE - ALL TEXT CONTENT */}
          <Box sx={{ flex: 1, width: '100%', maxWidth: { xs: '100%', lg: 'none' } }}>
            <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
              
        {/* Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: { xs: 2, md: 2.5 },
                  py: { xs: 0.8, md: 1 },
                  bgcolor: 'rgba(15, 15, 25, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 2,
                  mb: { xs: 3, md: 4 },
                  animation: 'fade-in-down 0.8s ease-out',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'rgba(96, 165, 250, 0.3)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                    fontWeight: 600,
                    letterSpacing: '0.3px',
                  }}
                >
                  Where Confusion Meets Clarity
                </Typography>
              </Box>

        {/* Main Heading */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem', lg: '5rem' },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  mb: { xs: 2, md: 2.5 },
                  animation: 'fade-in-up 0.8s ease-out 0.2s both',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    background: 'linear-gradient(to bottom, #fff, #a3a3a3)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
            From Lost to
                </Box>
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    background: 'linear-gradient(to right, #fff, #e5e5e5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mt: { xs: 0.3, md: 0.5 },
                  }}
                >
            Limitless
                </Box>
              </Typography>

        {/* Description */}
              <Box sx={{ mb: { xs: 2, md: 3 }, animation: 'fade-in 1s ease-out 0.4s both' }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.65)',
                    fontWeight: 400,
                    lineHeight: 1.7,
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    maxWidth: '540px',
                    mx: { xs: 'auto', lg: 0 },
                  }}
                >
                  AI-powered career guidance for students who know they're meant for something{' '}
                  <Box component="span" sx={{ fontWeight: 700, color: '#fff' }}>
                    big
                  </Box>
                  —they just haven't found it yet, or maybe{' '}
                  <Box component="span" sx={{ color: '#4ade80', fontWeight: 600 }}>
                    it's waiting to be built.
                  </Box>
                </Typography>
              </Box>

              {/* CTA Section */}
              <Box sx={{ animation: 'fade-in-up 1s ease-out 0.6s both', mt: { xs: 3, md: 5 } }}>
                {/* Welcome Message */}
                <Box sx={{ 
                  mb: { xs: 2.5, md: 3.5 },
                  p: { xs: 2.5, md: 3 },
                  bgcolor: 'rgba(74, 222, 128, 0.05)',
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  borderRadius: 2.5,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #4ade80, transparent)',
                    animation: 'shimmer 3s infinite',
                  },
                }}>
                  <Stack spacing={1.5}>
                    <Typography sx={{ 
                      color: '#4ade80',
                      fontSize: { xs: '0.75rem', md: '0.85rem' },
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                    }}>
                      Begin Your Discovery
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: { xs: '0.9rem', md: '0.95rem' },
                      lineHeight: 1.6,
                    }}>
                      Take a quick 5-minute assessment and unlock personalized insights about your perfect career path.
                    </Typography>
                  </Stack>
                </Box>

                {/* Creative Button */}
                <Button
                  component={Link}
                  to="/login"
          onClick={handleGetStarted}
                  variant="contained"
                  endIcon={<Rocket sx={{ animation: 'float 3s ease-in-out infinite' }} />}
                  sx={{
                    bgcolor: '#22c55e',
                    color: '#000',
                    px: { xs: 4, sm: 5 },
                    py: { xs: 2, md: 2.2 },
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 800,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.25)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(74, 222, 128, 0.4)',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      bgcolor: '#16a34a',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 30px rgba(34, 197, 94, 0.35)',
                    },
                  }}
                >
                  Discover Your Path
                </Button>

                {/* Subtle Encouragement */}
                <Typography sx={{ 
                  mt: { xs: 2, md: 2.5 },
                  color: 'rgba(255, 255, 255, 0.55)',
                  fontSize: { xs: '0.85rem', md: '0.9rem' },
                  fontWeight: 500,
                }}>
                  Join thousands of students finding their direction
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* RIGHT SIDE - CREATIVE COMPONENTS - DESKTOP ONLY */}
          <Box sx={{ flex: 1, width: '100%', position: 'relative', display: { xs: 'none', lg: 'block' } }}>
            
            {/* Bento Grid Layout */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridTemplateRows: 'repeat(4, 115px)',
              gap: 2.5,
            }}>
              
              {/* HUGE Partnership & Impact Card - Takes 4x3 Grid */}
              <Card
                sx={{
                  gridColumn: 'span 4',
                  gridRow: 'span 3',
                  bgcolor: 'rgba(15, 15, 25, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.5s ease',
                  animation: 'fade-in-right 1s ease-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'rgba(96, 165, 250, 0.4)',
                    boxShadow: '0 20px 50px rgba(96, 165, 250, 0.2)',
                    '& .icon-circle': {
                      bgcolor: 'rgba(96, 165, 250, 0.15)',
                      borderColor: 'rgba(96, 165, 250, 0.3)',
                    },
                    '& .gradient-overlay': {
                      opacity: 1,
                    },
                  },
                }}
              >
                {/* Gradient overlay on hover */}
                <Box
                  className="gradient-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '60%',
                    height: '100%',
                    background: 'radial-gradient(circle at top right, rgba(96, 165, 250, 0.1), transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.5s ease',
                    pointerEvents: 'none',
                  }}
                />

                <CardContent sx={{ position: 'relative', zIndex: 1, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Icon Circle with spinning border */}
                  <Box sx={{ position: 'relative', width: 'fit-content', mb: 1.5 }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: -4,
                        borderRadius: '50%',
                        border: '2px solid transparent',
                        borderTopColor: 'rgba(96, 165, 250, 0.4)',
                        animation: 'spin 4s linear infinite',
                      }}
                    />
                    <Box
                      className="icon-circle"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <School sx={{ color: '#60a5fa', fontSize: 32 }} />
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, mb: 2, fontSize: '1.25rem', lineHeight: 1.4 }}>
                    Partnering with<br />Schools & Universities
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, fontSize: '0.95rem', mb: 2 }}>
                    Working together with educational institutions to empower thousands of students in discovering their perfect career paths through AI-powered guidance.
                  </Typography>

                  {/* Bottom stats section */}
                  <Box sx={{ 
                    mt: 'auto',
                    pt: 2,
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    <Stack direction="row" spacing={3.5}>
                      <Box>
                        <Typography variant="h5" sx={{ 
                          color: '#60a5fa', 
                          fontWeight: 900, 
                          mb: 0.3, 
                          fontSize: '1.6rem',
                          lineHeight: 1,
                        }}>
                          10K+
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: 'rgba(255,255,255,0.5)', 
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}>
                          Students Empowered
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        width: '1px', 
                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                        alignSelf: 'stretch',
                      }} />

                      <Box>
                        <Typography variant="h5" sx={{ 
                          color: '#4ade80', 
                          fontWeight: 900, 
                          mb: 0.3, 
                          fontSize: '1.6rem',
                          lineHeight: 1,
                        }}>
                          AI-Driven
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: 'rgba(255,255,255,0.5)', 
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}>
                          Career Insights
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>

              {/* Spinning Test Circle - Top Right 2x2 */}
              <Card
                sx={{
                  gridColumn: '5 / span 2',
                  gridRow: 'span 2',
                  bgcolor: 'rgba(15, 15, 25, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s ease',
                  animation: 'float-card 3s ease-in-out infinite',
                  '&:hover': {
                    borderColor: 'rgba(192, 132, 252, 0.3)',
                    boxShadow: '0 15px 40px rgba(192, 132, 252, 0.2)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: '50%',
                      border: '4px solid rgba(192, 132, 252, 0.2)',
                      borderTopColor: '#C084FC',
                      borderRightColor: '#C084FC',
                      margin: '0 auto',
                      animation: 'spin 3s linear infinite',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h4" sx={{ color: '#C084FC', fontWeight: 900, mb: 0.5, fontSize: '2rem' }}>5K+</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600 }}>Tests Taken</Typography>
                </Box>
              </Card>

              {/* Upskilling Students - Middle Right 2x1 */}
              <Card
                sx={{
                  gridColumn: '5 / span 2',
                  gridRow: '3',
                  bgcolor: 'rgba(15, 15, 25, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.4s ease',
                  animation: 'float-card 3s ease-in-out infinite',
                  animationDelay: '0.5s',
                  '&:hover': {
                    borderColor: 'rgba(96, 165, 250, 0.3)',
                    boxShadow: '0 15px 40px rgba(96, 165, 250, 0.2)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5 }}>
                  <TrendingUp sx={{ color: '#60a5fa', fontSize: 38 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>Upskilling</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Students</Typography>
                  </Box>
                </Box>
              </Card>

              {/* Three horizontal cards at bottom 2x1 each */}
              <Card
                sx={{
                  gridColumn: 'span 2',
                  gridRow: '4',
                  bgcolor: 'rgba(15, 15, 25, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.4s ease',
                  animation: 'float-card 3s ease-in-out infinite',
                  animationDelay: '1s',
                  '&:hover': {
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                    boxShadow: '0 15px 40px rgba(168, 85, 247, 0.2)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: 1.5, px: 2 }}>
                  <Psychology sx={{ color: '#a855f7', fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>Exam AI &</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Career Beacon Assistant™</Typography>
                  </Box>
                </Box>
              </Card>

              <Card
                sx={{
                  gridColumn: '3 / span 2',
                  gridRow: '4',
                  bgcolor: 'rgba(15, 15, 25, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.4s ease',
                  animation: 'float-card 3s ease-in-out infinite',
                  animationDelay: '1.5s',
                  '&:hover': {
                    borderColor: 'rgba(251, 191, 36, 0.3)',
                    boxShadow: '0 15px 40px rgba(251, 191, 36, 0.2)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: 1.5, px: 2 }}>
                  <EmojiEvents sx={{ color: '#fbbf24', fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>Expert</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Mentorship</Typography>
                  </Box>
                </Box>
              </Card>

              <Card
                sx={{
                  gridColumn: '5 / span 2',
                  gridRow: '4',
                  bgcolor: 'rgba(15, 15, 25, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.4s ease',
                  animation: 'float-card 3s ease-in-out infinite',
                  animationDelay: '2s',
                  '&:hover': {
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                    boxShadow: '0 15px 40px rgba(34, 197, 94, 0.2)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: 1.5, px: 2 }}>
                  <Rocket sx={{ color: '#22c55e', fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>Guided</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Journey</Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float-card {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes float-icon {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Box>
  );
};

export default Hero;
