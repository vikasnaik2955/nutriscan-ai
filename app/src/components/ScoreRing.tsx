import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from '@/components/ui';
import { theme } from '@/theme';
import { bandColors, bandForScore } from '@/theme';

interface ScoreRingProps {
  score: number; // 0–10
  size?: number;
  strokeWidth?: number;
}

/** Circular 0–10 health-score gauge, colored by band. */
export function ScoreRing({ score, size = 168, strokeWidth = 14 }: ScoreRingProps) {
  const band = bandForScore(score);
  const { fg } = bandColors(band);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const fraction = Math.max(0, Math.min(1, score / 10));
  const offset = circumference * (1 - fraction);
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={r} stroke={theme.colors.surfaceSunken} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={center}
          cy={center}
          r={r}
          stroke={fg}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <View style={styles.row}>
          <Text variant="display" weight="extra" color={fg}>{score}</Text>
          <Text variant="h3" color={theme.colors.textMuted} style={styles.outOf}>/10</Text>
        </View>
        <Text variant="overline" color={fg}>{band}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'baseline' },
  outOf: { marginLeft: 2 },
});
