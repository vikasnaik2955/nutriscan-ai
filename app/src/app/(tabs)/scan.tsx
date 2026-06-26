import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { Flashlight, FlashlightOff, Barcode, Camera as CameraIcon } from 'lucide-react-native';
import { Button, Card, Screen, Text } from '@/components/ui';
import { useScanBarcode } from '@/hooks/useScans';
import { theme } from '@/theme';

const SAMPLES = [
  { code: '8901719110018', label: 'Amul Milk' },
  { code: '8901058000169', label: 'Maggi' },
  { code: '8901491101837', label: "Lay's" },
  { code: '8901030865019', label: 'Quaker Oats' },
];

export default function Scan() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const scanBarcode = useScanBarcode();

  const [torch, setTorch] = useState(false);
  const [manual, setManual] = useState('');
  const lock = useRef(false);

  // Re-arm the scanner whenever the screen regains focus (e.g. back from Result).
  useFocusEffect(
    useCallback(() => {
      lock.current = false;
      return () => { lock.current = true; };
    }, []),
  );

  const runScan = useCallback(
    (barcode: string) => {
      if (lock.current || scanBarcode.isPending) return;
      lock.current = true;
      scanBarcode.mutate(barcode.trim(), {
        onSuccess: (scan) => router.push({ pathname: '/result/[id]', params: { id: scan.id } }),
        onError: () => { lock.current = false; },
      });
    },
    [router, scanBarcode],
  );

  const onBarcode = (r: BarcodeScanningResult) => {
    if (r.data) runScan(r.data);
  };

  const granted = permission?.granted ?? false;

  return (
    <Screen scroll={!granted} padded={false} edges={['top']}>
      <View style={styles.headerPad}>
        <Text variant="h2">Scan a product</Text>
        <Text variant="sm" color={theme.colors.textSecondary}>Point at a barcode, or pick a sample below.</Text>
      </View>

      {granted ? (
        <View style={styles.cameraWrap}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            enableTorch={torch}
            barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_e', 'code128', 'code39', 'qr'] }}
            onBarcodeScanned={lock.current ? undefined : onBarcode}
          />
          {/* Reticle */}
          <View style={styles.overlay} pointerEvents="box-none">
            <View style={styles.frame} />
            <Pressable style={styles.torch} onPress={() => setTorch((t) => !t)} hitSlop={10}>
              {torch ? <Flashlight size={22} color="#fff" /> : <FlashlightOff size={22} color="#fff" />}
            </Pressable>
            {scanBarcode.isPending ? (
              <View style={styles.scanning}>
                <ActivityIndicator color="#fff" />
                <Text variant="sm" color="#fff">Reading…</Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : (
        <Card style={styles.permCard}>
          <CameraIcon size={40} color={theme.colors.brand} />
          <Text variant="h3" center>Camera access needed</Text>
          <Text variant="sm" center color={theme.colors.textSecondary}>
            Allow the camera to scan barcodes. You can also use a sample or enter a code manually below.
          </Text>
          <Button label="Grant camera access" onPress={requestPermission} />
        </Card>
      )}

      <View style={styles.panel}>
        <Text variant="overline" color={theme.colors.textMuted}>Try a sample</Text>
        <View style={styles.chips}>
          {SAMPLES.map((s) => (
            <Pressable key={s.code} style={styles.chip} onPress={() => runScan(s.code)}>
              <Text variant="caption" weight="semibold" color={theme.colors.brandStrong}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.manualRow}>
          <View style={styles.manualField}>
            <Barcode size={18} color={theme.colors.textMuted} />
            <TextInput
              style={styles.manualInput}
              placeholder="Enter a barcode"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="number-pad"
              value={manual}
              onChangeText={setManual}
              onSubmitEditing={() => manual.trim() && runScan(manual)}
            />
          </View>
          <Button label="Look up" size="md" fullWidth={false} disabled={!manual.trim()} onPress={() => runScan(manual)} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerPad: { paddingHorizontal: theme.layout.contentPad, paddingTop: theme.spacing[2], paddingBottom: theme.spacing[3], gap: 2 },
  cameraWrap: {
    marginHorizontal: theme.layout.contentPad, height: 360, borderRadius: theme.radius.xl,
    overflow: 'hidden', backgroundColor: '#000',
  },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  frame: {
    width: '70%', height: 150, borderRadius: theme.radius.lg,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)',
  },
  torch: {
    position: 'absolute', top: theme.spacing[3], right: theme.spacing[3],
    width: 44, height: 44, borderRadius: theme.radius.full,
    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  scanning: {
    position: 'absolute', bottom: theme.spacing[4], flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2],
    backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: theme.spacing[4], paddingVertical: theme.spacing[2],
    borderRadius: theme.radius.full,
  },
  permCard: { marginHorizontal: theme.layout.contentPad, alignItems: 'center', gap: theme.spacing[3] },
  panel: { paddingHorizontal: theme.layout.contentPad, paddingTop: theme.spacing[5], gap: theme.spacing[3] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] },
  chip: {
    paddingHorizontal: theme.spacing[3], paddingVertical: theme.spacing[2],
    backgroundColor: theme.colors.brandSoft, borderRadius: theme.radius.full,
  },
  manualRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2], marginTop: theme.spacing[1] },
  manualField: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2],
    minHeight: 48, paddingHorizontal: theme.spacing[3],
    borderWidth: 1.5, borderColor: theme.colors.borderStrong, borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceCard,
  },
  manualInput: { flex: 1, fontFamily: theme.fontFamily.medium, fontSize: theme.fontSize.body, color: theme.colors.textPrimary },
});
