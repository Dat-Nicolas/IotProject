import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import {
  useGetAllACsQuery,
  useCreateACMutation,
  useUpdateACMutation,
  useDeleteACMutation,
  ACFullResponse,
  ACMode,
} from '../../redux/api/adminAcApi';
import { useGetBrandsQuery } from '../../redux/api/brandApi';
import { useGetRoomsQuery } from '../../redux/api/roomApi';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = { ON: '#10B981', OFF: '#6B7280' };
const MODE_ICON: Record<ACMode, string> = { COOL: '❄️', DRY: '💧', FAN: '🌀', AUTO: '🤖' };

type FormState = { name: string; brandId: string; roomId: string; mode: ACMode; currentTemp: string };
const EMPTY: FormState = { name: '', brandId: '', roomId: '', mode: 'COOL', currentTemp: '25' };

// ─── Form Modal ───────────────────────────────────────────────────────────────

interface ACFormModalProps {
  visible: boolean;
  initial?: Partial<FormState>;
  isEdit: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (form: FormState) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

function ACFormModal({ visible, initial, isEdit, loading, onClose, onSubmit, colors }: ACFormModalProps) {
  const [form, setForm] = useState<FormState>({ ...EMPTY, ...initial });
  const { data: brands = [] } = useGetBrandsQuery();
  const { data: rooms = [] } = useGetRoomsQuery();

  React.useEffect(() => { setForm({ ...EMPTY, ...initial }); }, [initial, visible]);

  const patch = (k: keyof FormState) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const inputStyle = [styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
          <View style={[styles.sheet, { backgroundColor: colors.card }]}>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              {isEdit ? '✏️ Sửa điều hòa' : '➕ Thêm điều hòa'}
            </Text>

            <Text style={[styles.label, { color: colors.mutedText }]}>Tên thiết bị *</Text>
            <TextInput style={inputStyle} value={form.name} onChangeText={patch('name')} placeholder="VD: AC phòng khách" placeholderTextColor={colors.mutedText} />

            <Text style={[styles.label, { color: colors.mutedText }]}>Nhiệt độ mặc định</Text>
            <TextInput style={inputStyle} value={form.currentTemp} onChangeText={patch('currentTemp')} keyboardType="numeric" placeholder="25" placeholderTextColor={colors.mutedText} />

            <Text style={[styles.label, { color: colors.mutedText }]}>Chế độ</Text>
            <View style={styles.chipRow}>
              {(['COOL', 'DRY', 'FAN', 'AUTO'] as ACMode[]).map((m) => (
                <Pressable
                  key={m}
                  onPress={() => patch('mode')(m)}
                  style={[styles.chip, { borderColor: colors.border, backgroundColor: form.mode === m ? colors.primary : colors.card }]}
                >
                  <Text style={{ fontSize: 12, color: form.mode === m ? '#fff' : colors.text, fontWeight: '600' }}>
                    {MODE_ICON[m]} {m}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.mutedText }]}>Thương hiệu *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {brands.map((b) => (
                  <Pressable
                    key={b.id}
                    onPress={() => patch('brandId')(b.id)}
                    style={[styles.chip, { borderColor: colors.border, backgroundColor: form.brandId === b.id ? colors.secondary : colors.card }]}
                  >
                    <Text style={{ fontSize: 12, color: form.brandId === b.id ? '#fff' : colors.text, fontWeight: '600' }}>{b.name}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <Text style={[styles.label, { color: colors.mutedText }]}>Phòng *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {rooms.map((r) => (
                  <Pressable
                    key={r.id}
                    onPress={() => patch('roomId')(r.id)}
                    style={[styles.chip, { borderColor: colors.border, backgroundColor: form.roomId === r.id ? colors.primary : colors.card }]}
                  >
                    <Text style={{ fontSize: 12, color: form.roomId === r.id ? '#fff' : colors.text, fontWeight: '600' }}>{r.name}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <View style={styles.actions}>
              <Pressable onPress={onClose} style={[styles.btnCancel, { borderColor: colors.border }]}>
                <Text style={{ color: colors.mutedText, fontWeight: '600' }}>Huỷ</Text>
              </Pressable>
              <Pressable onPress={() => onSubmit(form)} disabled={loading}
                style={[styles.btnSave, { backgroundColor: colors.primary }]}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>{loading ? 'Đang lưu...' : 'Lưu'}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function ACManagementScreen() {
  const { colors } = useTheme();
  const { data: acs = [], isLoading, refetch } = useGetAllACsQuery();
  const [createAC, { isLoading: creating }] = useCreateACMutation();
  const [updateAC, { isLoading: updating }] = useUpdateACMutation();
  const [deleteAC] = useDeleteACMutation();

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<ACFullResponse | null>(null);

  const openCreate = () => { setEditTarget(null); setShowModal(true); };
  const openEdit = (a: ACFullResponse) => { setEditTarget(a); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (form: FormState) => {
    try {
      if (editTarget) {
        await updateAC({
          id: editTarget.id,
          data: {
            name: form.name.trim(),
            brandId: form.brandId || undefined,
            roomId: form.roomId || undefined,
            mode: form.mode,
            currentTemp: Number(form.currentTemp),
          },
        }).unwrap();
        Alert.alert('✅ Thành công', 'Cập nhật điều hòa thành công');
      } else {
        await createAC({
          name: form.name.trim(),
          brandId: form.brandId,
          roomId: form.roomId,
          mode: form.mode,
          currentTemp: Number(form.currentTemp),
        }).unwrap();
        Alert.alert('✅ Thành công', 'Thêm điều hòa thành công');
      }
      closeModal();
    } catch {
      Alert.alert('❌ Lỗi', 'Không thể lưu điều hòa');
    }
  };

  const handleDelete = (a: ACFullResponse) => {
    Alert.alert('Xoá điều hòa', `Bạn có chắc muốn xoá "${a.name}"?`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá', style: 'destructive',
        onPress: async () => {
          try { await deleteAC(a.id).unwrap(); }
          catch { Alert.alert('❌ Lỗi', 'Không thể xoá'); }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: ACFullResponse }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.acName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.acRoom, { color: colors.mutedText }]}>📍 {item.room?.name ?? '—'}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[item.status] }]}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{item.status}</Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.mutedText }}>{MODE_ICON[item.mode]} {item.mode}</Text>
        </View>
      </View>

      <View style={[styles.cardMeta, { borderTopColor: colors.divider }]}>
        <Text style={{ color: colors.mutedText, fontSize: 12 }}>🏷️ {item.brand?.name}</Text>
        <Text style={{ color: colors.mutedText, fontSize: 12 }}>🌡️ {item.currentTemp}°C</Text>
        <View style={styles.cardActions}>
          <Pressable onPress={() => openEdit(item)} style={[styles.iconBtn, { backgroundColor: colors.primaryLight }]}>
            <Text>✏️</Text>
          </Pressable>
          <Pressable onPress={() => handleDelete(item)} style={[styles.iconBtn, { backgroundColor: '#FEE2E2' }]}>
            <Text>🗑️</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>❄️ Quản lý điều hòa</Text>
        <Pressable onPress={openCreate} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 22, lineHeight: 26 }}>+</Text>
        </Pressable>
      </View>

      <FlatList
        data={acs}
        keyExtractor={(a) => a.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.mutedText }]}>Chưa có điều hòa nào</Text>}
      />

      <ACFormModal
        visible={showModal}
        initial={editTarget ? {
          name: editTarget.name,
          brandId: editTarget.brandId,
          roomId: editTarget.roomId,
          mode: editTarget.mode,
          currentTemp: String(editTarget.currentTemp),
        } : undefined}
        isEdit={!!editTarget}
        loading={creating || updating}
        onClose={closeModal}
        onSubmit={handleSubmit}
        colors={colors}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  addBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, gap: 12 },
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  cardTop: { flexDirection: 'row', padding: 14, gap: 8 },
  acName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  acRoom: { fontSize: 13 },
  statusDot: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-end' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, gap: 12 },
  cardActions: { marginLeft: 'auto', flexDirection: 'row', gap: 8 },
  iconBtn: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 15 },
  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 4, marginTop: 10 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  btnCancel: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12, borderWidth: 1 },
  btnSave: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12 },
});
