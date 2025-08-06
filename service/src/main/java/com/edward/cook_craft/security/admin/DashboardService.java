package com.edward.cook_craft.security.admin;

import com.edward.cook_craft.dto.request.DashBoardRequest;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RecipeRepository recipeRepository;

    public List<Map<String, Object>> getRecipesByYear(Integer year) {
        LocalDateTime startOfYear = LocalDate.of(year, 1, 1).atStartOfDay();
        LocalDateTime endOfYear = LocalDate.of(year, 12, 31).atTime(23, 59, 59);

        // Nếu là năm hiện tại -> chỉ lấy đến tháng hiện tại
        int currentYear = LocalDate.now().getYear();
        int maxMonth = (year == currentYear) ? LocalDate.now().getMonthValue() : 12;

        // Lấy danh sách công thức trong khoảng thời gian
        List<Recipe> recipes = recipeRepository.findByCreatedAtBetween(startOfYear, endOfYear);

        // Group theo tháng
        Map<Integer, Long> monthCountMap = recipes.stream()
                .collect(Collectors.groupingBy(
                        recipe -> recipe.getCreatedAt().getMonthValue(),
                        Collectors.counting()
                ));

        // Tạo list kết quả
        List<Map<String, Object>> stats = new ArrayList<>();
        for (int month = 1; month <= maxMonth; month++) {
            Map<String, Object> data = new HashMap<>();
            data.put("month", String.format("%04d-%02d", year, month)); // yyyy-MM
            data.put("count", monthCountMap.getOrDefault(month, 0L));
            stats.add(data);
        }

        return stats;
    }

    public List<Map<String, Object>> getRecipesByMonth(Integer year, Integer month) {
        // Ngày bắt đầu của tháng
        LocalDate startDate = LocalDate.of(year, month, 1);
        // Ngày kết thúc của tháng
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        // Nếu là tháng và năm hiện tại -> chỉ lấy đến ngày hôm nay
        LocalDate today = LocalDate.now();
        if (year.equals(today.getYear()) && month.equals(today.getMonthValue())) {
            endDate = today;
        }

        LocalDateTime startOfMonth = startDate.atStartOfDay();
        LocalDateTime endOfMonth = endDate.atTime(23, 59, 59);

        // Lấy danh sách công thức trong khoảng thời gian
        List<Recipe> recipes = recipeRepository.findByCreatedAtBetween(startOfMonth, endOfMonth);

        // Group theo ngày
        Map<Integer, Long> dayCountMap = recipes.stream()
                .collect(Collectors.groupingBy(
                        recipe -> recipe.getCreatedAt().getDayOfMonth(),
                        Collectors.counting()
                ));

        // Tạo list kết quả
        List<Map<String, Object>> stats = new ArrayList<>();
        int maxDay = endDate.getDayOfMonth();
        for (int day = 1; day <= maxDay; day++) {
            Map<String, Object> data = new HashMap<>();
            data.put("day", String.format("%04d-%02d-%02d", year, month, day)); // yyyy-MM-dd
            data.put("count", dayCountMap.getOrDefault(day, 0L));
            stats.add(data);
        }

        return stats;
    }

    public List<Map<String, Object>> getRecipesByMonthRange(DashBoardRequest request) {
        YearMonth startMonth = request.getStartMonth();
        YearMonth endMonth = request.getEndMonth() == null ? YearMonth.now() : request.getEndMonth();
        if (startMonth == null) {
            throw new CustomException("start.month.cannot.null");
        }
        if (startMonth.isAfter(endMonth)) {
            throw new CustomException("start.month.must.before.end.month");
        }

        LocalDateTime startDateTime = startMonth.atDay(1).atStartOfDay();
        LocalDateTime endDateTime = endMonth.atEndOfMonth().plusDays(1).atStartOfDay();

        List<Recipe> recipes = recipeRepository.findByCreatedAtBetween(startDateTime, endDateTime);

        // Gom nhóm theo tháng
        Map<YearMonth, Long> grouped = recipes.stream()
                .collect(Collectors.groupingBy(
                        recipe -> YearMonth.from(recipe.getCreatedAt()),
                        Collectors.counting()
                ));

        // Tạo danh sách đủ các tháng trong khoảng (kể cả tháng không có dữ liệu)
        List<Map<String, Object>> result = new ArrayList<>();
        YearMonth current = startMonth;
        while (!current.isAfter(endMonth)) {
            result.add(Map.of(
                    "month", current.toString(), // dạng yyyy-MM
                    "count", grouped.getOrDefault(current, 0L)
            ));
            current = current.plusMonths(1);
        }

        return result;
    }

    public List<Map<String, Object>> getRecipesByDateRange(DashBoardRequest request) {
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate() == null ? LocalDate.now() : request.getEndDate();

        // Nếu ngày bắt đầu hoặc ngày kết thúc null → trả về rỗng
        if (startDate == null) {
            throw new CustomException("start.date.cannot.null");
        }

        // Đảm bảo startDate <= endDate
        if (startDate.isAfter(endDate)) {
            throw new CustomException("start.date.must.before.end.date");
        }

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        // Lấy danh sách công thức trong khoảng thời gian
        List<Recipe> recipes = recipeRepository.findByCreatedAtBetween(startDateTime, endDateTime);

        // Group theo ngày
        Map<LocalDate, Long> dateCountMap = recipes.stream()
                .collect(Collectors.groupingBy(
                        recipe -> recipe.getCreatedAt().toLocalDate(),
                        Collectors.counting()
                ));

        // Tạo list kết quả từ startDate đến endDate
        List<Map<String, Object>> stats = new ArrayList<>();
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            Map<String, Object> data = new HashMap<>();
            data.put("date", currentDate.toString()); // yyyy-MM-dd
            data.put("count", dateCountMap.getOrDefault(currentDate, 0L));
            stats.add(data);
            currentDate = currentDate.plusDays(1);
        }

        return stats;
    }




}
