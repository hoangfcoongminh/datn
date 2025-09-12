package com.edward.cook_craft.service.admin;

import com.edward.cook_craft.dto.request.DashBoardRequest;
import com.edward.cook_craft.dto.response.StaticResponse;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.model.Recipe;
import com.edward.cook_craft.model.Review;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.RecipeRepository;
import com.edward.cook_craft.repository.ReviewRepository;
import com.edward.cook_craft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public enum GroupBy {
        YEAR, MONTH, DAY
    }

    /**
     * API gộp: thống kê công thức theo YEAR/MONTH/DAY, dùng startDate/endDate nếu có,
     * nếu không thì áp dụng mặc định theo yêu cầu.
     */
    public List<StaticResponse> getRecipeStats(DashBoardRequest request, GroupBy groupBy) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();

        // Áp dụng mặc định nếu không truyền
        if (startDate == null || endDate == null) {
            switch (groupBy) {
                case YEAR:
                    // 3 năm gần nhất: từ đầu năm (năm hiện tại - 2) đến hôm nay
                    startDate = today.minusYears(2).with(TemporalAdjusters.firstDayOfYear());
                    endDate = today;
                    break;
                case MONTH:
                    // từ đầu năm hiện tại đến hôm nay
                    startDate = today.with(TemporalAdjusters.firstDayOfYear());
                    endDate = today;
                    break;
                case DAY:
                    // từ đầu tháng hiện tại đến hôm nay
                    startDate = today.with(TemporalAdjusters.firstDayOfMonth());
                    endDate = today;
                    break;
                default:
                    throw new CustomException("invalid.groupBy");
            }
        }

        if (startDate.isAfter(endDate)) {
            throw new CustomException("start.date.must.before.end.date");
        }

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        // Lấy dữ liệu trong khoảng
        List<Recipe> recipes = recipeRepository.findByCreatedAtBetween(startDateTime, endDateTime);

        // Gom nhóm theo groupBy
        Map<String, Long> grouped = groupRecipes(recipes, groupBy);

        // Trả về đầy đủ các mốc thời gian trong khoảng (kể cả 0)
        return formatResult(grouped, groupBy, startDate, endDate);
    }

    private Map<String, Long> groupRecipes(List<Recipe> recipes, GroupBy groupBy) {
        return recipes.stream().collect(Collectors.groupingBy(r -> {
            LocalDateTime c = r.getCreatedAt();
            switch (groupBy) {
                case YEAR:
                    return String.format("%04d", c.getYear()); // "2025"
                case MONTH:
                    return String.format("%04d-%02d", c.getYear(), c.getMonthValue()); // "2025-08"
                case DAY:
                    return c.toLocalDate().toString(); // "2025-08-28"
                default:
                    throw new IllegalArgumentException("Invalid groupBy");
            }
        }, Collectors.counting()));
    }

    public List<StaticResponse> getUserStats(DashBoardRequest request, GroupBy groupBy) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();

        // Áp dụng mặc định nếu không truyền
        if (startDate == null || endDate == null) {
            switch (groupBy) {
                case YEAR:
                    startDate = today.minusYears(2).with(TemporalAdjusters.firstDayOfYear());
                    endDate = today;
                    break;
                case MONTH:
                    startDate = today.with(TemporalAdjusters.firstDayOfYear());
                    endDate = today;
                    break;
                case DAY:
                    startDate = today.with(TemporalAdjusters.firstDayOfMonth());
                    endDate = today;
                    break;
                default:
                    throw new CustomException("invalid.groupBy");
            }
        }

        if (startDate.isAfter(endDate)) {
            throw new CustomException("start.date.must.before.end.date");
        }

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        // Lấy dữ liệu trong khoảng
        List<User> users = userRepository.findByCreatedAtBetween(startDateTime, endDateTime);

        // Gom nhóm theo groupBy
        Map<String, Long> grouped = groupUsers(users, groupBy);

        // Trả về đầy đủ các mốc thời gian trong khoảng (kể cả 0)
        return formatResult(grouped, groupBy, startDate, endDate);
    }

    private Map<String, Long> groupUsers(List<User> users, GroupBy groupBy) {
        return users.stream().collect(Collectors.groupingBy(u -> {
            LocalDateTime c = u.getCreatedAt();
            switch (groupBy) {
                case YEAR:
                    return String.format("%04d", c.getYear());
                case MONTH:
                    return String.format("%04d-%02d", c.getYear(), c.getMonthValue());
                case DAY:
                    return c.toLocalDate().toString();
                default:
                    throw new IllegalArgumentException("Invalid groupBy");
            }
        }, Collectors.counting()));
    }

    // Thống kê hoạt động user theo khoảng thời gian
    public List<StaticResponse> getUserActivity(DashBoardRequest request, GroupBy groupBy) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();

        if (startDate == null || endDate == null) {
            switch (groupBy) {
                case YEAR:
                    startDate = today.minusYears(2).with(TemporalAdjusters.firstDayOfYear());
                    endDate = today;
                    break;
                case MONTH:
                    startDate = today.with(TemporalAdjusters.firstDayOfYear());
                    endDate = today;
                    break;
                case DAY:
                    startDate = today.with(TemporalAdjusters.firstDayOfMonth());
                    endDate = today;
                    break;
                default:
                    throw new CustomException("invalid.groupBy");
            }
        }

        if (startDate.isAfter(endDate)) {
            throw new CustomException("start.date.must.before.end.date");
        }

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        // Lấy toàn bộ review trong khoảng
        List<Review> reviews = reviewRepository.findByCreatedAtBetween(startDateTime, endDateTime);

        // Gom nhóm theo groupBy
        Map<String, Long> grouped = reviews.stream().collect(Collectors.groupingBy(r -> {
            LocalDateTime c = r.getCreatedAt();
            switch (groupBy) {
                case YEAR:
                    return String.format("%04d", c.getYear());
                case MONTH:
                    return String.format("%04d-%02d", c.getYear(), c.getMonthValue());
                case DAY:
                    return c.toLocalDate().toString();
                default:
                    throw new IllegalArgumentException("Invalid groupBy");
            }
        }, Collectors.counting()));

        // Trả về đầy đủ mốc thời gian trong khoảng
        return formatResult(grouped, groupBy, startDate, endDate);
    }

    private List<StaticResponse> formatResult(Map<String, Long> grouped, GroupBy groupBy,
                                              LocalDate start, LocalDate end) {
        List<StaticResponse> result = new ArrayList<>();

        switch (groupBy) {
            case YEAR: {
                int y = start.getYear();
                int yEnd = end.getYear();
                for (; y <= yEnd; y++) {
                    String key = String.format("%04d", y);
                    result.add(new StaticResponse(key, grouped.getOrDefault(key, 0L)));
                }
                break;
            }
            case MONTH: {
                YearMonth cur = YearMonth.from(start);
                YearMonth last = YearMonth.from(end);
                while (!cur.isAfter(last)) {
                    String key = cur.toString(); // yyyy-MM
                    result.add(new StaticResponse(key, grouped.getOrDefault(key, 0L)));
                    cur = cur.plusMonths(1);
                }
                break;
            }
            case DAY: {
                LocalDate cur = start;
                while (!cur.isAfter(end)) {
                    String key = cur.toString(); // yyyy-MM-dd
                    result.add(new StaticResponse(key, grouped.getOrDefault(key, 0L)));
                    cur = cur.plusDays(1);
                }
                break;
            }
            default:
                throw new CustomException("invalid.groupBy");
        }

        return result;
    }
}
