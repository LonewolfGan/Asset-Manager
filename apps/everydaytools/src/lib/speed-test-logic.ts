export interface SpeedTestSuitability {
  gaming: { supported: boolean; rating: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
  streaming4k: { supported: boolean; rating: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
  videoCalls: { supported: boolean; rating: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
  download10GbMinutes: number;
}

export interface SpeedTestAssessment {
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  jitterMs: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  gradeLabel: string;
  connectionTier: string;
  latencyRating: 'Ultra-low' | 'Low' | 'Moderate' | 'High';
  latencyLabel: string;
  streamingMaxResolution: string;
  suitability: SpeedTestSuitability;
}

export function assessNetworkQuality(metrics: {
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  jitterMs: number;
}): SpeedTestAssessment {
  const { downloadMbps, uploadMbps, pingMs, jitterMs } = metrics;

  // Grade determination (kept for backward compatibility with existing tests)
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'C';
  let gradeLabel = 'Fair Connection';

  if (downloadMbps >= 100 && pingMs <= 25 && jitterMs <= 5) {
    grade = 'A+';
    gradeLabel = 'Ultra Fast & Stable (Gigabit / Fiber)';
  } else if (downloadMbps >= 50 && pingMs <= 40 && jitterMs <= 10) {
    grade = 'A';
    gradeLabel = 'Fast Broadband';
  } else if (downloadMbps >= 25 && pingMs <= 70) {
    grade = 'B';
    gradeLabel = 'Standard Broadband';
  } else if (downloadMbps >= 10) {
    grade = 'C';
    gradeLabel = 'Basic Connection';
  } else {
    grade = 'D';
    gradeLabel = 'Essential Connection';
  }

  // Connection Tier classification based on bandwidth
  let connectionTier = 'Essential Connection';
  if (downloadMbps >= 100) {
    connectionTier = 'Gigabit / Fiber Broadband';
  } else if (downloadMbps >= 50) {
    connectionTier = 'Superfast Broadband';
  } else if (downloadMbps >= 25) {
    connectionTier = 'Fast Broadband';
  } else if (downloadMbps >= 10) {
    connectionTier = 'Standard Broadband';
  }

  // Independent Latency Rating
  let latencyRating: 'Ultra-low' | 'Low' | 'Moderate' | 'High' = 'High';
  let latencyLabel = 'High Latency (> 80 ms)';
  if (pingMs <= 20) {
    latencyRating = 'Ultra-low';
    latencyLabel = 'Ultra-low Latency (< 20 ms)';
  } else if (pingMs <= 45) {
    latencyRating = 'Low';
    latencyLabel = 'Low Latency (< 45 ms)';
  } else if (pingMs <= 80) {
    latencyRating = 'Moderate';
    latencyLabel = 'Moderate Latency (< 80 ms)';
  }

  // Streaming resolution capacity
  let streamingMaxResolution = 'SD 480p';
  if (downloadMbps >= 50) {
    streamingMaxResolution = '4K Ultra HD (Multi-screen)';
  } else if (downloadMbps >= 25) {
    streamingMaxResolution = '4K Ultra HD';
  } else if (downloadMbps >= 10) {
    streamingMaxResolution = 'Full HD 1080p';
  } else if (downloadMbps >= 5) {
    streamingMaxResolution = 'HD 720p';
  }

  // Gaming
  let gamingRating: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Poor';
  let gamingDesc = 'High latency may cause noticeable lag.';
  if (pingMs <= 25 && jitterMs <= 4) {
    gamingRating = 'Excellent';
    gamingDesc = 'Optimal for competitive esports and cloud gaming.';
  } else if (pingMs <= 50 && jitterMs <= 10) {
    gamingRating = 'Good';
    gamingDesc = 'Very smooth multiplayer gaming experience.';
  } else if (pingMs <= 90) {
    gamingRating = 'Fair';
    gamingDesc = 'Playable for casual games, minor latency.';
  }

  // 4K Streaming (requires ~25 Mbps)
  let streamingRating: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Poor';
  let streamingDesc = 'Insufficient bandwidth for 4K without buffering.';
  if (downloadMbps >= 50) {
    streamingRating = 'Excellent';
    streamingDesc = 'Seamless multi-device 4K HDR streaming.';
  } else if (downloadMbps >= 25) {
    streamingRating = 'Good';
    streamingDesc = 'Smooth 4K playback on a single screen.';
  } else if (downloadMbps >= 10) {
    streamingRating = 'Fair';
    streamingDesc = 'Ideal for 1080p Full HD; 4K may buffer.';
  }

  // Video Calls (requires ~5 Mbps down, 3 Mbps up, < 80ms ping)
  let videoRating: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Poor';
  let videoDesc = 'Call quality may drop or stutter.';
  if (downloadMbps >= 15 && uploadMbps >= 5 && pingMs <= 40) {
    videoRating = 'Excellent';
    videoDesc = 'Crystal clear HD video conferences with screen sharing.';
  } else if (downloadMbps >= 5 && uploadMbps >= 2 && pingMs <= 80) {
    videoRating = 'Good';
    videoDesc = 'Reliable video calls with standard quality.';
  } else if (downloadMbps >= 2 && uploadMbps >= 1) {
    videoRating = 'Fair';
    videoDesc = 'Standard definition video with occasional audio artifacts.';
  }

  // 10 GB file download time in minutes
  // 10 GB = 80,000 Megabits
  const download10GbSeconds = downloadMbps > 0 ? 80000 / downloadMbps : 0;
  const download10GbMinutes = Number((download10GbSeconds / 60).toFixed(1));

  return {
    downloadMbps,
    uploadMbps,
    pingMs,
    jitterMs,
    grade,
    gradeLabel,
    connectionTier,
    latencyRating,
    latencyLabel,
    streamingMaxResolution,
    suitability: {
      gaming: {
        supported: gamingRating !== 'Poor',
        rating: gamingRating,
        description: gamingDesc,
      },
      streaming4k: {
        supported: streamingRating !== 'Poor',
        rating: streamingRating,
        description: streamingDesc,
      },
      videoCalls: {
        supported: videoRating !== 'Poor',
        rating: videoRating,
        description: videoDesc,
      },
      download10GbMinutes,
    },
  };
}
