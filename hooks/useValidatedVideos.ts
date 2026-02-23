/**
 * Hook to get validated videos that filters out failed/unembeddable content
 */

import { useMemo, useEffect, useState } from 'react';
import { Video } from '../types';
import { INITIAL_VIDEOS } from '../constants';
import {
  filterValidVideos,
  getFailedVideos,
  validateVideos,
  extractYouTubeId,
} from '../services/videoValidationService';

// Get all valid videos (filters out known failed videos)
export const useValidatedVideos = () => {
  const [validVideos, setValidVideos] = useState<Video[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // Initial filter based on known failed videos
  useEffect(() => {
    const filtered = filterValidVideos(INITIAL_VIDEOS);
    setValidVideos(filtered);
  }, []);

  return {
    videos: validVideos,
    isValidating,
    // Utility functions
    getVideo: (id: string) => validVideos.find(v => v.id === id),
    getShorts: () => validVideos.filter(v => v.isVertical === true),
    getLongForm: () => validVideos.filter(v => !v.isVertical && v.duration > 120),
  };
};

// Get only shorts videos
export const useShorts = () => {
  const shorts = useMemo(() => {
    const allShorts = INITIAL_VIDEOS.filter(v => v.isVertical === true);
    return filterValidVideos(allShorts);
  }, []);

  return shorts;
};

// Get only long-form videos
export const useLongFormVideos = () => {
  const longForm = useMemo(() => {
    const all = INITIAL_VIDEOS.filter(v => !v.isVertical && v.duration > 120);
    return filterValidVideos(all);
  }, []);

  return longForm;
};

// Hook to check and report video validity
export const useVideoValidation = (videoId: string | undefined) => {
  const [isValid, setIsValid] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!videoId) return;

    const failed = getFailedVideos();
    if (failed.has(videoId)) {
      setIsValid(false);
      return;
    }

    // Video is assumed valid until proven otherwise
    setIsValid(true);
  }, [videoId]);

  return { isValid, isChecking };
};

export default useValidatedVideos;
