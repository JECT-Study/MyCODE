import { Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export default function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View className="items-center justify-center gap-y-1">
      <Text className="text-lg font-medium text-[#424242]">{title}</Text>
      {subtitle && (
        <Text className="text-base font-normal text-[#9E9E9E]">{subtitle}</Text>
      )}
    </View>
  );
}
