import type { WebRTCFingerprint } from '@/types/fingerprint';

// IP 地址分类函数
function classifyIP(ip: string): 'public' | 'private' | 'link-local' | 'loopback' {
  // 回环地址
  if (ip === '127.0.0.1' || ip.startsWith('127.')) {
    return 'loopback';
  }
  
  // 链路本地地址 (169.254.0.0/16)
  if (ip.startsWith('169.254.')) {
    return 'link-local';
  }
  
  // 私有地址
  // 10.0.0.0/8
  if (ip.startsWith('10.')) {
    return 'private';
  }
  
  // 172.16.0.0/12
  const parts = ip.split('.');
  if (parts.length === 4) {
    const secondOctet = parseInt(parts[1], 10);
    if (ip.startsWith('172.') && secondOctet >= 16 && secondOctet <= 31) {
      return 'private';
    }
  }
  
  // 192.168.0.0/16
  if (ip.startsWith('192.168.')) {
    return 'private';
  }
  
  // 其他都是公网 IP
  return 'public';
}

// 检查是否是有效的 IPv4 地址
function isValidIPv4(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

export async function detectWebRTC(): Promise<WebRTCFingerprint> {
  return new Promise((resolve) => {
    try {
      const RTCPeerConnection = window.RTCPeerConnection || 
                                (window as any).webkitRTCPeerConnection ||
                                (window as any).mozRTCPeerConnection;

      if (!RTCPeerConnection) {
        resolve({
          localIPs: [],
          publicIPs: [],
          privateIPs: [],
          linkLocalIPs: [],
          leakDetected: false,
          ipTypes: {},
        });
        return;
      }

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      const allIPs: string[] = [];
      const ipTypes: { [ip: string]: 'public' | 'private' | 'link-local' | 'loopback' } = {};
      const publicIPs: string[] = [];
      const privateIPs: string[] = [];
      const linkLocalIPs: string[] = [];
      let leakDetected = false;

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          
          // 匹配 IPv4 地址
          const ipv4Match = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
          if (ipv4Match) {
            const ip = ipv4Match[1];
            
            if (isValidIPv4(ip)) {
              const ipType = classifyIP(ip);
              
              // 只记录非回环地址
              if (ipType !== 'loopback') {
                if (!allIPs.includes(ip)) {
                  allIPs.push(ip);
                  ipTypes[ip] = ipType;
                  
                  switch (ipType) {
                    case 'public':
                      publicIPs.push(ip);
                      leakDetected = true; // 公网 IP 泄露
                      break;
                    case 'private':
                      privateIPs.push(ip);
                      break;
                    case 'link-local':
                      linkLocalIPs.push(ip);
                      break;
                  }
                }
              }
            }
          }
          
          // 也尝试匹配 host candidate (host)
          const hostMatch = candidate.match(/host\s+([0-9]{1,3}(\.[0-9]{1,3}){3})/);
          if (hostMatch) {
            const ip = hostMatch[1];
            if (isValidIPv4(ip)) {
              const ipType = classifyIP(ip);
              if (ipType !== 'loopback' && !allIPs.includes(ip)) {
                allIPs.push(ip);
                ipTypes[ip] = ipType;
                
                switch (ipType) {
                  case 'public':
                    publicIPs.push(ip);
                    leakDetected = true;
                    break;
                  case 'private':
                    privateIPs.push(ip);
                    break;
                  case 'link-local':
                    linkLocalIPs.push(ip);
                    break;
                }
              }
            }
          }
        }
      };

      // 监听 ICE 连接状态
      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          pc.close();
        }
      };

      // 创建数据通道触发候选收集
      try {
        pc.createDataChannel('');
        pc.createOffer()
          .then(offer => {
            return pc.setLocalDescription(offer);
          })
          .catch((error) => {
            console.warn('WebRTC offer failed:', error);
            pc.close();
            resolve({
              localIPs: [],
              publicIPs: [],
              privateIPs: [],
              linkLocalIPs: [],
              leakDetected: false,
              ipTypes: {},
            });
          });
      } catch (error) {
        console.warn('WebRTC setup failed:', error);
        resolve({
          localIPs: [],
          publicIPs: [],
          privateIPs: [],
          linkLocalIPs: [],
          leakDetected: false,
          ipTypes: {},
        });
        return;
      }

      // 5秒后返回结果（增加时间以收集更多候选）
      setTimeout(() => {
        pc.close();
        resolve({
          localIPs: [...new Set(allIPs)],
          publicIPs: [...new Set(publicIPs)],
          privateIPs: [...new Set(privateIPs)],
          linkLocalIPs: [...new Set(linkLocalIPs)],
          publicIP: publicIPs.length > 0 ? publicIPs[0] : undefined,
          leakDetected,
          ipTypes,
        });
      }, 5000);
    } catch (e) {
      console.warn('WebRTC detection failed:', e);
      resolve({
        localIPs: [],
        publicIPs: [],
        privateIPs: [],
        linkLocalIPs: [],
        leakDetected: false,
        ipTypes: {},
      });
    }
  });
}
