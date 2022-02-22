import { styled } from "@css/theme.config"
import { motion } from "framer-motion"

export const MusicContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100vw",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
})

export const MusicGrid = styled(motion.div, {
  display: "grid",
  gap: 30,
  gridTemplateColumns: "200px 200px 200px 200px",
  gridTemplateRows: "auto",
  width: "60vw",
  justifyContent: "center",
  marginTop: 100,
  ".playing": {
    background: "$main",
  },
})

export const AudioBox = styled(motion.button, {
  outline: 0,
  border: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "$primary",
  background: "$fg",
  fontSize: "$6",
  width: 200,
  height: 200,
  borderRadius: 30,
  transition: "0.2s linear",
  userSelect: "none",
  "&:hover": {
    cursor: "pointer",
  },
})

export const AudioText = styled("p", {
  fontSize: "$3",
  margin: "10px 0 20px 0",
})

export const Bar = styled("input", {
  zIndex: 100,
  appearance: "none",
  height: 7,
  outline: "none",
  background: "$primary",
  borderRadius: 10,
  "&::-webkit-slider-thumb": {
    appearance: "none",
    width: 20,
    height: 20,
    borderRadius: 100,
    background: "$primary",
    cursor: "pointer",
    transition: "0.1s linear",
  },
  "&::-webkit-slider-thumb:hover": {
    transform: "scale(1.2)",
  },
})