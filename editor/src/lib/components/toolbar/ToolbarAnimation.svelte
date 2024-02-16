<script lang="ts">
  import { onMount } from "svelte";
  import {
    Motion,
    useAnimation,
    useMotionTemplate,
    useMotionValue,
  } from "svelte-motion";

  const x = useMotionValue(0);
  const y = useMotionValue(100);
  const rotate = useMotionValue(0);
  const shadow = useMotionTemplate`drop-shadow(${x}px ${y}px 20px rgba(0,0,0,0.05))`;
  const controls = useAnimation();

  onMount(() => {
    controls.start({
      x: 0, // Target value for x
      y: 0, // Target value for y
      rotate: 0, // Target rotation in degrees
      transition: { duration: 1, type: "spring" }, // Customize the duration, type of the animation, etc.
    });
  });
</script>

<Motion
  animate={controls}
  drag
  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
  style={{ x, y, rotate, filter: shadow }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 1 }}
  let:motion
>
  <div use:motion class="relative bottom-3">
    <slot />
  </div>
</Motion>
