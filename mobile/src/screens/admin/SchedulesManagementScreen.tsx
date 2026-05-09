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
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  ScheduleResponse,
  DayOfWeek,
} from '../../redux/api/scheduleApi';
import { useGetRoomsQuery } from '../../redux/api/roomApi';

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const DAY_FULL = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

// ─── Form Modal ───────────────────────────────────────────────────────────────

type FormState = {
  roomId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
};
const EMPTY: FormState = { roomId: '', dayOfWeek: 1, startTime: '08:00', endTime: '17:00', isActive: true };

interface ScheduleFormModalProps {
  visible: boolean;
  initial?: Partial<FormState>;
  isEdit: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (form: FormState) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

function ScheduleFormModal({ visible, initial, isEdit, loading, onClose, onSubmit, colors }: ScheduleFormModalProps) {
  const [form, setForm] = useState<FormState>({ ...EMPTY, ...initial });
  const { data: rooms = [] } = useGetRoomsQuery();

  React.useEffect(() => { setForm({ ...EMPTY, ...initial }); }, [initial, visible]);

  const inputStyle = [styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
          <View style={[styles.sheet, { backgroundColor: colors.card }]}>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              {isEdit ? '✏️ Sửa lịch' : '➕ Thêm lịch hẹn'}
            </Text>

            {/* Phòng */}
            <Text style={[styles.label, { color: colors.mutedText }]}>Phòng *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {rooms.map((r) => (
                  <Pressable
                    key={r.id}
                    onPress={() => setForm((f) => ({ ...f, roomId: r.id }))}
                    style={[styles.chip, { borderColor: colors.border, backgroundColor: form.roomId === r.id ? colors.primary : colors.card }]}
                  >
                    <Text style={{ fontSize: 12, color: form.roomId === r.id ? '#fff' : colors.text, fontWeight: '600' }}>{r.name}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Ngày trong tuần */}
            <Text style={[styles.label, { color: colors.mutedText }]}>Ngày trong tuần *</Text>
            <View style={styles.dayRow}>
              {DAY_LABELS.map((label, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setForm((f) => ({ ...f, dayOfWeek: idx as DayOfWeek }))}
                  style={[
                    styles.dayChip,
                    { borderColor: colors.border, backgroundColor: form.dayOfWeek === idx ? colors.primary : colors.card },
                  ]}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: form.dayOfWeek === idx ? '#fff' : colors.text }}>{label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Giờ */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.mutedText }]}>Giờ bắt đầu</Text>
                <TextInput
                  style={inputStyle}
                  value={form.startTime}
                  onChangeText={(v) => setForm((f) => ({ ...f, startTime: v }))}
                  placeholder="08:00"
                  placeholderTextColor={colors.mutedText}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.mutedText }]}>Giờ kết thúc</Text>
                <TextInput
                  style={inputStyle}
                  value={form.endTime}
                  onChangeText={(v) => setForm((f) => ({ ...f, endTime: v }))}
                  placeholder="17:00"
                  placeholderTextColor={colors.mutedText}
                />
              </View>
            </View>

            {/* Trạng thái */}
            <View style={[styles.activeRow, { borderColor: colors.border }]}>
              <Text style={[styles.activeLabel, { color: colors.text }]}>Kích hoạt lịch</Text>
              <Switch
                value={form.isActive}
                onValueChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                thumbColor={form.isActive ? colors.primary : '#ccc'}
                trackColor={{ false: colors.disabled, true: colors.primaryLight }}
              />
            </View>

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

export default function SchedulesManagementScreen() {
  const { colors } = useTheme();
  const { data: schedules = [], isLoading, refetch } = useGetSchedulesQuery();
  const [createSchedule, { isLoading: creating }] = useCreateScheduleMutation();
  const [updateSchedule, { isLoading: updating }] = useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<ScheduleResponse | null>(null);

  const openCreate = () => { setEditTarget(null); setShowModal(true); };
  const openEdit = (s: ScheduleResponse) => { setEditTarget(s); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (form: FormState) => {
    try {
      if (editTarget) {
        await updateSchedule({
          id: editTarget.id,
          data: { dayOfWeek: form.dayOfWeek, startTime: form.startTime, endTime: form.endTime, isActive: form.isActive },
        }).unwrap();
        Alert.alert('✅ Thành công', 'Cập nhật lịch thành công');
      } else {
        await createSchedule({
          roomId: form.roomId,
          dayOfWeek: form.dayOfWeek,
          startTime: form.startTime,
          endTime: form.endTime,
          isActive: form.isActive,
        }).unwrap();
        Alert.alert('✅ Thành công', 'Thêm lịch thành công');
      }
      closeModal();
    } catch {
      Alert.alert('❌ Lỗi', 'Không thể lưu lịch');
    }
  };

  const handleToggleActive = async (s: ScheduleResponse) => {
    try {
      await updateSchedule({ id: s.id, data: { isActive: !s.isActive } }).unwrap();
    } catch {
      Alert.alert('❌ Lỗi', 'Không thể cập nhật trạng thái');
    }
  };

  const handleDelete = (s: ScheduleResponse) => {
    Alert.alert('Xoá lịch', `Xoá lịch ${DAY_FULL[s.dayOfWeek]} ${s.startTime}–${s.endTime}?`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá', style: 'destructive',
        onPress: async () => {
          try { await deleteSchedule(s.id).unwrap(); }
          catch { Alert.alert('❌ Lỗi', 'Không thể xoá lịch'); }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: ScheduleResponse }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Day badge */}
      <View style={[styles.dayBadge, { backgroundColor: item.isActive ? colors.primary : colors.disabled }]}>
        <Text style={styles.dayBadgeText}>{DAY_LABELS[item.dayOfWeek]}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[styles.timeText, { color: colors.text }]}>
          🕐 {item.startTime} – {item.endTime}
        </Text>
        <Text style={[styles.roomText, { color: colors.mutedText }]}>
          📍 {item.room?.name ?? item.roomId}
        </Text>
        <Text style={[styles.dayFullText, { color: colors.mutedText }]}>{DAY_FULL[item.dayOfWeek]}</Text>
      </View>

      <View style={styles.cardRight}>
        <Switch
          value={item.isActive}
          onValueChange={() => handleToggleActive(item)}
          thumbColor={item.isActive ? colors.primary : '#ccc'}
          trackColor={{ false: colors.disabled, true: colors.primaryLight }}
        />
        <Pressable onPress={() => openEdit(item)} style={[styles.iconBtn, { backgroundColor: colors.primaryLight }]}>
          <Text style={{ fontSize: 16 }}>✏️</Text>
        </Pressable>
        <Pressable onPress={() => handleDelete(item)} style={[styles.iconBtn, { backgroundColor: '#FEE2E2' }]}>
          <Text style={{ fontSize: 16 }}>🗑️</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>🗓️ Quản lý lịch hẹn</Text>
        <Pressable onPress={openCreate} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 22, lineHeight: 26 }}>+</Text>
        </Pressable>
      </View>

      <FlatList
        data={schedules}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.mutedText }]}>Chưa có lịch nào</Text>}
      />

      <ScheduleFormModal
        visible={showModal}
        initial={editTarget ? {
          roomId: editTarget.roomId,
          dayOfWeek: editTarget.dayOfWeek,
          startTime: editTarget.startTime,
          endTime: editTarget.endTime,
          isActive: editTarget.isActive,
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
  card: {
    borderRadius: 14, borderWidth: 1, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  dayBadge: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  dayBadgeText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  timeText: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  roomText: { fontSize: 12, marginBottom: 2 },
  dayFullText: { fontSize: 12 },
  cardRight: { flexDirection: 'column', alignItems: 'center', gap: 8 },
  iconBtn: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 15 },
  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 4, marginTop: 10 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15 },
  dayRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  dayChip: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  activeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  activeLabel: { fontSize: 15, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  btnCancel: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12, borderWidth: 1 },
  btnSave: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12 },
});
