import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled Components
const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  background-color: #0a0a0a;
  overflow: hidden;
`;

const LoginSidebar = styled.div`
  width: 40%;
  background-color: rgba(18, 18, 24, 0.95);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top left, rgba(52, 152, 219, 0.08) 0%, transparent 70%);
    z-index: -1;
  }
  
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const LoginGraphic = styled.div`
  flex: 1;
  background: linear-gradient(-45deg, #3498db, #2c3e50, #16a085, #2980b9);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const GraphicOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 2rem;
  text-align: center;
  z-index: 2;
`;

const GraphicTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 1s ease-out;
  background: linear-gradient(90deg, #ffffff, #3498db);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  
  span {
    color: #3498db;
    text-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
  }
`;

const GraphicText = styled.p`
  font-size: 1.3rem;
  max-width: 80%;
  line-height: 1.7;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 1s ease-out 0.3s both;
`;

const SecurityFeature = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
  animation: ${fadeIn} 1s ease-out 0.6s both;
  
  .material-icons {
    font-size: 1.5rem;
    margin-right: 0.75rem;
    color: #3498db;
  }
  
  span {
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const GridElement = styled.div`
  position: absolute;
  width: ${props => props.size || '150px'};
  height: ${props => props.size || '150px'};
  border: 2px solid rgba(255, 255, 255, ${props => props.opacity || '0.1'});
  border-radius: 10px;
  top: ${props => props.top || '0'};
  left: ${props => props.left || '0'};
  transform: rotate(${props => props.rotate || '0deg'});
  animation: ${float} ${props => props.duration || '6s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  backdrop-filter: blur(5px);
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(0, 0, 0, 0));
    border-radius: 8px;
  }
`;

const CircleDecoration = styled.div`
  position: absolute;
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  border-radius: 50%;
  background: ${props => props.color || 'rgba(52, 152, 219, 0.2)'};
  top: ${props => props.top || '0'};
  left: ${props => props.left || '0'};
  filter: blur(${props => props.blur || '0px'});
  z-index: 0;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.8s ease-out;
  
  .logo-text {
    background: linear-gradient(90deg, #3498db, #2980b9);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-weight: 800;
  }
  
  .material-icons {
    font-size: 2.5rem;
    margin-right: 0.75rem;
    color: #3498db;
    animation: ${pulse} 2s infinite ease-in-out;
  }
`;

const LoginHeading = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  animation: ${fadeIn} 0.8s ease-out 0.2s both;
`;

const LoginSubheading = styled.p`
  color: #aaa;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  animation: ${fadeIn} 0.8s ease-out 0.4s both;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 420px;
  animation: ${fadeIn} 0.8s ease-out 0.6s both;
`;

// Glass morphism style for tabs
const LoginTypeTabs = styled.div`
  display: flex;
  margin-bottom: 3rem;
  background-color: rgba(30, 30, 40, 0.4);
  border-radius: 20px;
  padding: 0.5rem;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
`;

const LoginTypeTab = styled.button`
  flex: 1;
  padding: 1rem 0;
  background-color: transparent;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
`;

const TabSlider = styled.div`
  position: absolute;
  top: 0.5rem;
  left: ${props => props.position === 'user' ? '0.5rem' : '50%'};
  width: calc(50% - 1rem);
  height: calc(100% - 1rem);
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.8), rgba(41, 128, 185, 0.8));
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  z-index: 1;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

// Glass morphism style for inputs
const InputGroup = styled.div`
  margin-bottom: 2.2rem;
  position: relative;
  transition: all 0.3s ease;
  
  &:focus-within {
    transform: translateY(-3px);
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.focused ? '#3498db' : 'rgba(255, 255, 255, 0.5)'};
  transition: all 0.3s ease;
  z-index: 5;
  pointer-events: none;
  
  .material-icons {
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1.3rem 1.2rem 1.3rem 3.2rem;
  font-size: 1rem;
  background-color: rgba(30, 30, 40, 0.3);
  border: 1px solid ${props => props.error ? 'rgba(231, 76, 60, 0.8)' : props.focused ? 'rgba(52, 152, 219, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  color: white;
  transition: all 0.3s ease;
  box-shadow: ${props => props.focused ? '0 0 20px rgba(52, 152, 219, 0.15)' : 'none'};
  backdrop-filter: blur(4px);
  
  &:focus {
    outline: none;
    border-color: rgba(52, 152, 219, 0.8);
    background-color: rgba(52, 152, 219, 0.05);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    transition: opacity 0.3s ease;
  }
  
  &:focus::placeholder {
    opacity: 0;
  }
  
  &:not(:placeholder-shown)::placeholder {
    opacity: 0;
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin: -0.5rem 0 2rem;
  
  a {
    color: #3498db;
    font-size: 0.85rem;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 1px;
      bottom: -2px;
      left: 0;
      background-color: #3498db;
      transition: width 0.3s ease;
    }
    
    &:hover {
      color: #2980b9;
      
      &:after {
        width: 100%;
      }
    }
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.6rem;
  margin-left: 1.2rem;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-out;
  
  .material-icons {
    font-size: 0.9rem;
    margin-right: 0.4rem;
  }
`;

// Glass morphism style for button
const LoginButton = styled.button`
  width: 100%;
  padding: 1.3rem;
  background: linear-gradient(90deg, rgba(52, 152, 219, 0.9), rgba(41, 128, 185, 0.9));
  background-size: 200% auto;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background-position: right center;
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
    
    &:before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    background: linear-gradient(90deg, rgba(119, 119, 119, 0.7), rgba(85, 85, 85, 0.7));
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .material-icons {
    font-size: 1.3rem;
    margin-right: 0.6rem;
  }
`;

const SignupPrompt = styled.div`
  margin-top: 2.5rem;
  text-align: center;
  color: #aaa;
  font-size: 0.95rem;
  animation: ${fadeIn} 0.8s ease-out 0.8s both;
  
  a {
    color: #3498db;
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.5rem;
    transition: all 0.3s ease;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -3px;
      left: 0;
      background-color: #3498db;
      transition: width 0.3s ease;
    }
    
    &:hover {
      color: #2980b9;
      
      &:after {
        width: 100%;
      }
    }
  }
`;

const LoadingSpinner = styled.div`
  width: 1.3rem;
  height: 1.3rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${rotateAnimation} 0.8s linear infinite;
  margin-right: 0.7rem;
`;

const SecurityCamera = styled.div`
  position: absolute;
  top: 10%;
  right: 15%;
  animation: ${float} 5s ease-in-out infinite;
  z-index: 3;
  
  .camera-body {
    width: 60px;
    height: 40px;
    background: #2c3e50;
    border-radius: 5px;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .camera-lens {
    position: absolute;
    width: 25px;
    height: 25px;
    background: #16a085;
    border-radius: 50%;
    top: 7.5px;
    left: 5px;
    border: 3px solid #2c3e50;
    
    &:after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      top: 3px;
      left: 3px;
    }
  }
  
  .camera-mount {
    width: 10px;
    height: 30px;
    background: #7f8c8d;
    position: absolute;
    bottom: -30px;
    left: 25px;
  }
  
  .camera-indicator {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #e74c3c;
    border-radius: 50%;
    top: 5px;
    right: 5px;
    animation: ${pulse} 2s infinite;
  }
`;

const LoginPage = ({ onLogin }) => {
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const validateForm = () => {
    let isValid = true;
    
    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };
  
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        
        // For demo: hardcoded credentials
        if (loginType === 'admin' && email === 'admin@security.com' && password === 'admin123') {
          if (onLogin) {
            onLogin({
              name: "Admin User",
              email: "admin@security.com",
              role: "System Administrator",
              initials: "AU",
              isAdmin: true
            });
          }
        } else if (loginType === 'user' && email === 'user@security.com' && password === 'user123') {
          if (onLogin) {
            onLogin({
              name: "Security User",
              email: "user@security.com",
              role: "Security Operator",
              initials: "SU",
              isAdmin: false
            });
          }
        } else {
          setLoginError('Invalid email or password');
        }
      }, 1500);
    }
  };
  
  return (
    <LoginContainer>
      <LoginSidebar>
        <CircleDecoration size="250px" top="-120px" left="-120px" color="rgba(52, 152, 219, 0.05)" blur="60px" />
        <CircleDecoration size="200px" bottom="-80px" right="-80px" color="rgba(52, 152, 219, 0.07)" blur="50px" />
        
        <Logo>
          <span className="material-icons">security</span>
          <span className="logo-text">MDI AI Detection</span>
        </Logo>
        
        <LoginHeading>Welcome back</LoginHeading>
        <LoginSubheading>Secure access to your AI detection system</LoginSubheading>
        
        <LoginForm onSubmit={handleLogin}>
          <LoginTypeTabs>
            <TabSlider position={loginType} />
            <LoginTypeTab
              type="button"
              active={loginType === 'user'}
              onClick={() => setLoginType('user')}
            >
              User Access
            </LoginTypeTab>
            <LoginTypeTab
              type="button"
              active={loginType === 'admin'}
              onClick={() => setLoginType('admin')}
            >
              Admin Access
            </LoginTypeTab>
          </LoginTypeTabs>
          
          {loginError && (
            <ErrorMessage style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(231, 76, 60, 0.1)', borderRadius: '10px' }}>
              <span className="material-icons">error_outline</span>
              {loginError}
            </ErrorMessage>
          )}
          
          <InputGroup>
            <InputIcon focused={emailFocused}>
              <span className="material-icons" aria-hidden="true">email</span>
            </InputIcon>
            <Input
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              focused={emailFocused}
              error={!!emailError}
              autoComplete="email"
              aria-label="Email Address"
            />
            {emailError && (
              <ErrorMessage>
                <span className="material-icons">error_outline</span>
                {emailError}
              </ErrorMessage>
            )}
          </InputGroup>
          
          <InputGroup>
            <InputIcon focused={passwordFocused}>
              <span className="material-icons" aria-hidden="true">lock</span>
            </InputIcon>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              focused={passwordFocused}
              error={!!passwordError}
              autoComplete="current-password"
              aria-label="Password"
            />
            {passwordError && (
              <ErrorMessage>
                <span className="material-icons">error_outline</span>
                {passwordError}
              </ErrorMessage>
            )}
          </InputGroup>
          
          <ForgotPassword>
            <a href="#forgot-password">Forgot password?</a>
          </ForgotPassword>
          
          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner />
                Authenticating...
              </>
            ) : (
              <>
                <span className="material-icons">login</span>
                {loginType === 'admin' ? 'Login as Administrator' : 'Secure Login'}
              </>
            )}
          </LoginButton>
        </LoginForm>
        
        <SignupPrompt>
          Need an account for your organization?
          <a href="#signup">Request Access</a>
        </SignupPrompt>
      </LoginSidebar>
      
      <LoginGraphic>
        <GridElement top="15%" left="15%" rotate="15deg" size="180px" duration="7s" />
        <GridElement top="65%" left="65%" rotate="-10deg" size="220px" duration="9s" delay="0.5s" opacity="0.15" />
        <GridElement top="35%" left="55%" rotate="45deg" size="120px" duration="6s" delay="1s" opacity="0.2" />
        <GridElement top="20%" left="70%" rotate="-25deg" size="150px" duration="8s" delay="1.5s" opacity="0.1" />
        
        <SecurityCamera />
        
        <GraphicOverlay>
          <GraphicTitle>AI-Powered <span>Security</span></GraphicTitle>
          <GraphicText>
            Advanced machine learning detection system for enhanced security monitoring and real-time threat analysis.
          </GraphicText>
          
          <SecurityFeature>
            <span className="material-icons">verified_user</span>
            <span>Real-time threat detection and alerts</span>
          </SecurityFeature>
          
          <SecurityFeature>
            <span className="material-icons">analytics</span>
            <span>Advanced analytics and reporting</span>
          </SecurityFeature>
          
          <SecurityFeature>
            <span className="material-icons">integration_instructions</span>
            <span>Seamless integration with existing systems</span>
          </SecurityFeature>
          
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            {currentTime} | System Status: Online
          </div>
        </GraphicOverlay>
      </LoginGraphic>
    </LoginContainer>
  );
};

export default LoginPage; 