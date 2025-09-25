package com.edward.cook_craft.service.admin;

import com.edward.cook_craft.enums.EntityStatus;
import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.UserRepository;
import com.edward.cook_craft.service.admin.dto.request.AddUserReq;
import com.edward.cook_craft.service.admin.dto.response.UserResponse;
import com.edward.cook_craft.service.minio.MinioService;
import com.edward.cook_craft.utils.JsonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import static com.edward.cook_craft.constants.Constants.FILE_TYPE_IMAGE;

@Service
@RequiredArgsConstructor
public class User_AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MinioService minioService;

    @Value("${image.default.avt}")
    private String defaultAvt;

    public UserResponse addUser(String jsonRequest, MultipartFile file) {
        AddUserReq request = JsonUtils.jsonMapper(jsonRequest, AddUserReq.class);
        validate(request);
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setId(null);
        user.setStatus(EntityStatus.ACTIVE.getStatus());
        if (file != null && !file.isEmpty()) {
            user.setImgUrl(minioService.uploadFile(file, FILE_TYPE_IMAGE));
        } else {
            user.setImgUrl(defaultAvt);
        }
        user.setRole(request.getRole());
        user = userRepository.save(user);

        UserResponse userResponse = new UserResponse();
        userResponse.setUsername(user.getUsername());
        userResponse.setFullName(user.getFullName());
        userResponse.setRole(user.getRole());
        userResponse.setImgUrl(user.getImgUrl());
        userResponse.setStatus(user.getStatus());
        return userResponse;
    }

    private void validate(AddUserReq request) {
        if (userRepository.findByUsernameAndActive(request.getUsername()).isPresent()) {
            throw new CustomException("user.name.exists");
        }
    }
}
