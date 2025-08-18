package com.edward.cook_craft.security.admin;

import com.edward.cook_craft.dto.request.DashBoardRequest;
import com.edward.cook_craft.dto.response.StaticResponse;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RecipeRepository recipeRepository;

    public enum GroupBy {
        YEAR, MONTH, DAY
    }

    /**
     * Lấy thống kê số lượng công thức theo khoảng thời gian và đơn vị nhóm.
     *
     * @param request Yêu cầu chứa thông tin khoảng thời gian
     * @param groupBy Đơn vị nhóm dữ liệu (YEAR, MONTH, DAY)
     * @return Danh sách thống kê với định dạng chuẩn
     */
    public List<StaticResponse> getRecipeStats(DashBoardRequest request, GroupBy groupBy) {
        LocalDateTime startDateTime;
        LocalDateTime endDateTime;

        // Xác định khoảng thời gian
        if (groupBy == GroupBy.YEAR) {
            Integer year = request.getYear();
            if (year == null) {
                throw new CustomException("year.cannot.null");
            }
            startDateTime = LocalDate.of(year, 1, 1).atStartOfDay();
            endDateTime = LocalDate.of(year, 12, 31).atTime(23, 59, 59);
            if (year == LocalDate.now().getYear()) {
                endDateTime = LocalDate.now().atTime(23, 59, 59);
            }
        } else if (groupBy == GroupBy.MONTH) {
            Integer year = request.getYear();
            Integer month = request.getMonth();
            if (year == null || month == null) {
                throw new CustomException("year.and.month.cannot.null");
            }
            YearMonth yearMonth = YearMonth.of(year, month);
            startDateTime = yearMonth.atDay(1).atStartOfDay();
            endDateTime = yearMonth.atEndOfMonth().atTime(23, 59, 59);
            if (year == LocalDate.now().getYear() && month == LocalDate.now().getMonthValue()) {
                endDateTime = LocalDate.now().atTime(23, 59, 59);
            }
        } else {
            LocalDate startDate = request.getStartDate();
            LocalDate endDate = request.getEndDate() == null ? LocalDate.now() : request.getEndDate();
            if (startDate == null) {
                throw new CustomException("start.date.cannot.null");
            }
            if (startDate.isAfter(endDate)) {
                throw new CustomException("start.date.must.before.end.date");
            }
            startDateTime = startDate.atStartOfDay();
            endDateTime = endDate.atTime(23, 59, 59);
        }

        // Lấy danh sách công thức
        List<Recipe> recipes = recipeRepository.findByCreatedAtBetween(startDateTime, endDateTime);

        // Gom nhóm dữ liệu
        Map<String, Long> groupedData = groupRecipes(recipes, groupBy, startDateTime, endDateTime);

        // Chuyển đổi thành định dạng trả về
        return formatResult(groupedData, groupBy, startDateTime, endDateTime);
    }

    /**
     * Gom nhóm công thức theo đơn vị thời gian.
     */
    private Map<String, Long> groupRecipes(List<Recipe> recipes, GroupBy groupBy, LocalDateTime start, LocalDateTime end) {
        if (groupBy == GroupBy.YEAR) {
            return recipes.stream()
                    .collect(Collectors.groupingBy(
                            recipe -> String.format("%04d-%02d", recipe.getCreatedAt().getYear(), recipe.getCreatedAt().getMonthValue()),
                            Collectors.counting()
                    ));
        } else if (groupBy == GroupBy.MONTH) {
            return recipes.stream()
                    .collect(Collectors.groupingBy(
                            recipe -> String.format("%04d-%02d-%02d", recipe.getCreatedAt().getYear(), recipe.getCreatedAt().getMonthValue(), recipe.getCreatedAt().getDayOfMonth()),
                            Collectors.counting()
                    ));
        } else {
            return recipes.stream()
                    .collect(Collectors.groupingBy(
                            recipe -> recipe.getCreatedAt().toLocalDate().toString(), // yyyy-MM-dd
                            Collectors.counting()
                    ));
        }
    }

    /**
     * Định dạng kết quả trả về, đảm bảo bao gồm tất cả các đơn vị thời gian trong khoảng.
     */
    private List<StaticResponse> formatResult(Map<String, Long> groupedData, GroupBy groupBy, LocalDateTime start, LocalDateTime end) {
        List<StaticResponse> result = new ArrayList<>();
        LocalDate currentDate = start.toLocalDate();
        LocalDate endDate = end.toLocalDate();

        if (groupBy == GroupBy.YEAR) {
            YearMonth current = YearMonth.from(start);
            YearMonth endMonth = YearMonth.from(end);
            while (!current.isAfter(endMonth)) {
                String timeUnit = current.toString(); // yyyy-MM
                result.add(new StaticResponse(timeUnit, groupedData.getOrDefault(timeUnit, 0L)));
                current = current.plusMonths(1);
            }
        } else if (groupBy == GroupBy.MONTH) {
            while (!currentDate.isAfter(endDate)) {
                String timeUnit = currentDate.toString(); // yyyy-MM-dd
                result.add(new StaticResponse(timeUnit, groupedData.getOrDefault(timeUnit, 0L)));
                currentDate = currentDate.plusDays(1);
            }
        } else {
            while (!currentDate.isAfter(endDate)) {
                String timeUnit = currentDate.toString(); // yyyy-MM-dd
                result.add(new StaticResponse(timeUnit, groupedData.getOrDefault(timeUnit, 0L)));
                currentDate = currentDate.plusDays(1);
            }
        }

        return result;
    }

    /**
     * Các phương thức cũ để giữ tương thích (nếu cần).
     */
    public List<StaticResponse> getRecipesByYear(Integer year) {
        return getRecipeStats(DashBoardRequest.builder().year(year).build(), GroupBy.YEAR);
    }

    public List<StaticResponse> getRecipesByMonth(Integer year, Integer month) {
        return getRecipeStats(DashBoardRequest.builder().year(year).month(month).build(), GroupBy.MONTH);
    }

    public List<StaticResponse> getRecipesByMonthRange(DashBoardRequest request) {
        return getRecipeStats(request, GroupBy.YEAR);
    }

    public List<StaticResponse> getRecipesByDateRange(DashBoardRequest request) {
        return getRecipeStats(request, GroupBy.DAY);
    }
}
