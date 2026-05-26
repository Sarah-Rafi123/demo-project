import { useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from "react-native-svg";

import { COLORS } from "@/constants/theme";
import type { Verdict } from "@/types";

interface Props {
  verdict: Verdict | null;
  status: "idle" | "listening" | "settling" | "result";
  size?: number;
}

const NEEDLE_REST = 0;
const NEEDLE_TRUTH = -70;
const NEEDLE_LIE = 70;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const start = polar(cx, cy, r, endDeg);
  const end = polar(cx, cy, r, startDeg);
  const largeArc = endDeg - startDeg <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export default function Meter({ verdict, status, size = 320 }: Props) {
  const angle = useSharedValue(NEEDLE_REST);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (status === "listening") {
      pulse.value = withTiming(1, { duration: 600 });
      angle.value = withTiming(0, { duration: 300 });
    } else {
      pulse.value = withTiming(0, { duration: 300 });
    }
  }, [status, pulse, angle]);

  useEffect(() => {
    if (verdict === "truth") {
      angle.value = withSpring(NEEDLE_TRUTH, { damping: 8, stiffness: 90 });
    } else if (verdict === "lie") {
      angle.value = withSpring(NEEDLE_LIE, { damping: 8, stiffness: 90 });
    } else if (status === "idle") {
      angle.value = withSpring(NEEDLE_REST, { damping: 10, stiffness: 80 });
    }
  }, [verdict, status, angle]);

  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${angle.value}deg` }],
  }));

  const glowOpacity = useDerivedValue(() => pulse.value * 0.6);
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  const dims = useMemo(() => {
    const cx = size / 2;
    const cy = size * 0.72;
    const r = size * 0.42;
    const inner = r - 22;
    return { cx, cy, r, inner };
  }, [size]);

  const truthArc = arcPath(dims.cx, dims.cy, dims.r, -90, -10);
  const lieArc = arcPath(dims.cx, dims.cy, dims.r, 10, 90);
  const neutralArc = arcPath(dims.cx, dims.cy, dims.r, -10, 10);

  const ticks = useMemo(() => {
    const out: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
    for (let i = -90; i <= 90; i += 10) {
      const isMajor = i % 30 === 0;
      const outer = polar(dims.cx, dims.cy, dims.r - 6, i);
      const innerR = isMajor ? dims.r - 22 : dims.r - 14;
      const inner = polar(dims.cx, dims.cy, innerR, i);
      out.push({
        x1: outer.x,
        y1: outer.y,
        x2: inner.x,
        y2: inner.y,
        key: `t${i}`,
      });
    }
    return out;
  }, [dims]);

  const needleLength = dims.r - 18;
  const height = size * 0.78;

  return (
    <View style={{ width: size, height }} className="items-center justify-end">
      <Svg width={size} height={height} viewBox={`0 0 ${size} ${height}`}>
        <Defs>
          <LinearGradient id="truthGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={COLORS.truth} stopOpacity="0.95" />
            <Stop offset="1" stopColor={COLORS.truth} stopOpacity="0.55" />
          </LinearGradient>
          <LinearGradient id="lieGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={COLORS.lie} stopOpacity="0.55" />
            <Stop offset="1" stopColor={COLORS.lie} stopOpacity="0.95" />
          </LinearGradient>
        </Defs>

        <Path
          d={truthArc}
          stroke="url(#truthGrad)"
          strokeWidth={20}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={lieArc}
          stroke="url(#lieGrad)"
          strokeWidth={20}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={neutralArc}
          stroke={COLORS.border}
          strokeWidth={20}
          strokeLinecap="round"
          fill="none"
        />

        <G>
          {ticks.map((t) => (
            <Path
              key={t.key}
              d={`M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`}
              stroke={COLORS.muted}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.6}
            />
          ))}
        </G>
      </Svg>

      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            width: dims.r * 2.2,
            height: dims.r * 2.2,
            borderRadius: dims.r * 1.1,
            top: dims.cy - dims.r * 1.1,
            left: dims.cx - dims.r * 1.1,
            backgroundColor: COLORS.accent,
          },
          glowStyle,
        ]}
      />

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: dims.cx,
          top: dims.cy,
          width: 0,
          height: 0,
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              left: -4,
              top: -needleLength,
              width: 8,
              height: needleLength,
              borderRadius: 4,
              backgroundColor: COLORS.text,
              transformOrigin: "4px 100%",
            },
            needleStyle,
          ]}
        />
      </View>

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: dims.cx - 16,
          top: dims.cy - 16,
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: COLORS.surfaceAlt,
          borderWidth: 3,
          borderColor: COLORS.text,
        }}
      />

      <Svg
        width={size}
        height={height}
        viewBox={`0 0 ${size} ${height}`}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <Circle cx={dims.cx} cy={dims.cy} r={5} fill={COLORS.bg} />
      </Svg>

      <View
        pointerEvents="none"
        className="absolute"
        style={{ left: 16, top: dims.cy - 8 }}
      >
        <Text className="text-emerald-400 text-sm font-bold tracking-widest">
          TRUTH
        </Text>
      </View>
      <View
        pointerEvents="none"
        className="absolute"
        style={{ right: 16, top: dims.cy - 8 }}
      >
        <Text className="text-red-400 text-sm font-bold tracking-widest">
          LIE
        </Text>
      </View>
    </View>
  );
}
