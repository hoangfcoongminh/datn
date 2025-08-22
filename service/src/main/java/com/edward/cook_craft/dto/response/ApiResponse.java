package com.edward.cook_craft.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Collection;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class ApiResponse<T> {

    private boolean success;
    private int code;
    private String title;
    private String message;
    private T data;
    private Long total;
    private Integer page;
    private String sort;

//    public static <T> ApiResponse<T> success(T data) {
//        return new ApiResponse<>(true, HttpStatus.OK.value(), null, null, data);
//    }

    @SuppressWarnings("unchecked")
    public static <T> ApiResponse<T> success(T data) {
        Long total = null;
        Integer page = null;
        String sort = null;
        Object responseData = data;

        if (data != null) {
            if (data instanceof Page<?> pageData) {
                responseData = pageData.getContent();
                total = pageData.getTotalElements();
                page = pageData.getNumber();

                if (pageData.getSort().isSorted()) {
                    sort = pageData.getSort().toString().replaceAll(": ", ",").replaceAll("\\s+", "");
                }
            } else if (data instanceof Collection) {
                total = (long) ((Collection<?>) data).size();
            } else {
                total = 1L; // Đối tượng đơn lẻ
            }
        } else {
            total = 0L; // Data là null
        }

        return new ApiResponse<>(true, HttpStatus.OK.value(), null, null, (T) responseData, total, page, sort);
    }

    public static <T> ApiResponse<T> failure(int code, String title, String message) {

        return new ApiResponse<>(false, code, title, message, null, null, null, null);
    }
}
