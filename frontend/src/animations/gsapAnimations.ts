import gsap from 'gsap';

export const playIntroTimeline = (
  logoRef: HTMLElement | null,
  taglineRef: HTMLElement | null,
  containerRef: HTMLElement | null,
  mountainLayerLeftRef?: HTMLElement | null,
  mountainLayerRightRef?: HTMLElement | null,
  backlightRef?: HTMLElement | null,
  onComplete?: () => void
) => {
  if (!logoRef || !taglineRef || !containerRef) return;

  const tl = gsap.timeline({
    onComplete: () => {
      if (onComplete) onComplete();
    },
  });

  // Initial setup: 3D paper fold states and soft blur
  gsap.set(logoRef, {
    opacity: 0,
    filter: 'blur(16px)',
    scale: 0.88,
    rotationX: 35,
    transformPerspective: 1200,
    transformOrigin: '50% 50% -40px',
  });

  gsap.set(taglineRef, {
    opacity: 0,
    y: 25,
    filter: 'blur(8px)',
  });

  if (backlightRef) {
    gsap.set(backlightRef, {
      opacity: 0,
      scale: 0.4,
    });
  }

  if (mountainLayerLeftRef && mountainLayerRightRef) {
    gsap.set(mountainLayerLeftRef, {
      xPercent: 0,
      opacity: 0.85,
    });
    gsap.set(mountainLayerRightRef, {
      xPercent: 0,
      opacity: 0.85,
    });
  }

  // Animation timeline (Total ~3.4s)
  // Step 1: Mountain silhouettes gently part / unfold
  if (mountainLayerLeftRef && mountainLayerRightRef) {
    tl.to(mountainLayerLeftRef, {
      xPercent: -12,
      opacity: 0.6,
      duration: 1.8,
      ease: 'power3.out',
    }, 0).to(mountainLayerRightRef, {
      xPercent: 12,
      opacity: 0.6,
      duration: 1.8,
      ease: 'power3.out',
    }, 0);
  }

  // Step 2: Soft golden-emerald backlight blooms from behind text
  if (backlightRef) {
    tl.to(backlightRef, {
      opacity: 1,
      scale: 1.2,
      duration: 1.4,
      ease: 'power2.out',
    }, 0.2);
  }

  // Step 3: "Safe-Yatra AI" 3D origami paper unrolls & sharpens
  tl.to(logoRef, {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    rotationX: 0,
    duration: 1.3,
    ease: 'power3.out',
  }, 0.3);

  // Step 4: Staggered subtitle reveal
  tl.to(taglineRef, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.9,
    ease: 'power2.out',
  }, '-=0.5');

  // Step 5: Brief hold, then gentle fade out into the scenic hero
  tl.to({}, { duration: 0.85 });

  tl.to(containerRef, {
    opacity: 0,
    scale: 1.03,
    filter: 'blur(8px)',
    duration: 0.75,
    ease: 'power2.inOut',
    pointerEvents: 'none',
  });

  return tl;
};
