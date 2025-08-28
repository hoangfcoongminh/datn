package com.edward.cook_craft.mapper;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class GenericMapper {

    // Map một object từ entity -> DTO
    public static <T, U> U map(T source, Class<U> targetClass) {
        if (source == null) return null;

        try {
            U target = targetClass.getDeclaredConstructor().newInstance();

            List<Field> sourceFields = getAllFields(new ArrayList<>(), source.getClass());
            List<Field> targetFields = getAllFields(new ArrayList<>(), targetClass);

            for (Field sourceField : sourceFields) {
                sourceField.setAccessible(true);
                Object value = sourceField.get(source);

                for (Field targetField : targetFields) {
                    targetField.setAccessible(true);
                    if (targetField.getName().equals(sourceField.getName())
                            && targetField.getType().isAssignableFrom(sourceField.getType())) {
                        targetField.set(target, value);
                        break;
                    }
                }
            }

            return target;
        } catch (Exception e) {
            throw new RuntimeException("Error mapping objects", e);
        }
    }

    private static List<Field> getAllFields(List<Field> fields, Class<?> type) {
        if (type == null) {
            return fields;
        }
        fields.addAll(List.of(type.getDeclaredFields()));
        return getAllFields(fields, type.getSuperclass());
    }


    // Map List<Entity> -> List<DTO>
    public static <T, U> List<U> mapList(List<T> sourceList, Class<U> targetClass) {
        List<U> result = new ArrayList<>();
        if (sourceList != null) {
            for (T item : sourceList) {
                result.add(map(item, targetClass));
            }
        }
        return result;
    }
}
