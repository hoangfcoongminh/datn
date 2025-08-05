package com.edward.cook_craft.service;

import com.edward.cook_craft.dto.request.UpdateUserRequest;
import com.edward.cook_craft.dto.response.UserResponse;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.mapper.UserMapper;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.UserRepository;
import com.edward.cook_craft.service.minio.MinioService;
import com.edward.cook_craft.utils.CommonUtils;
import com.edward.cook_craft.utils.JsonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final MinioService minioService;

    public UserResponse details(Long id) {
        User user = userRepository.findByIdAndActive(id).orElseThrow(() -> new CustomException("user.not.found"));
        return userMapper.toResponse(user);
    }

    public UserResponse update(String jsonRequest, MultipartFile file) {
        UpdateUserRequest request = JsonUtils.jsonMapper(jsonRequest, UpdateUserRequest.class);
        validate(request);

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new CustomException("user.not.found"));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        if (file != null && !file.isEmpty()) {
            String existsAvtUrl = user.getImgUrl();
            minioService.deleteFile(existsAvtUrl);
            user.setImgUrl(minioService.uploadFile(file));
        }

        user = userRepository.save(user);

        return userMapper.toResponse(user);
    }

    private void validate(UpdateUserRequest request) {
        if (!CommonUtils.isValidEmail(request.getEmail())) {
            throw new CustomException("email.invalid");
        }
    }

}
