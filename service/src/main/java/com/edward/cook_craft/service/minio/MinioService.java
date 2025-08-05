package com.edward.cook_craft.service.minio;

import com.edward.cook_craft.exception.CustomException;
import io.minio.*;
import io.minio.http.Method;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucketName;

    @Value("${minio.url}")
    private String url;

    @PostConstruct
    public void initBucket() {
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }
        } catch (Exception e) {
            log.error("Error initializing MinIO bucket {}", e.getMessage());
            throw new RuntimeException("Error initializing MinIO bucket", e);
        }
    }

    public String uploadFile(MultipartFile file) {
        try {

            String filename = file.getOriginalFilename();

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(filename)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            return url + "/images/" + filename;

        } catch (Exception e) {
            throw new CustomException("fail.to.upload.file " + e.getMessage());
        }
    }

    public void deleteFile(String fileName) {
        try {
            if (fileName == null || fileName.isEmpty()) {
                return;
            }
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .build()
            );
        } catch (Exception e) {
            throw new CustomException("fail.to.upload.file");
        }
    }

    public String generatePresignedUrl(String fileName, int timeExpiryInSeconds) {
        try {
            if (fileName == null || fileName.isEmpty()) {
                return null;
            }
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(fileName)
                            .expiry(timeExpiryInSeconds)
                            .build()
            );
        } catch (Exception e) {
            throw new CustomException("fail.to.upload.file");
        }
    }

    public byte[] getFileAsBytes(String fileName) {
        try (InputStream stream = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(fileName)
                        .build()
        )) {
            return stream.readAllBytes();
        } catch (Exception e) {
            throw new RuntimeException("Failed to read file from MinIO", e);
        }
    }

//    public void setDefaultImg(String type, MultipartFile img) {
//        try {
//
//            String fileName;
//            if (type.equalsIgnoreCase("avt")) {
//                deleteFile(DEFAULT_IMG_AVT);
//                fileName = DEFAULT_IMG_AVT;
//            } else {
//                deleteFile(DEFAULT_IMG_SEAT);
//                fileName = DEFAULT_IMG_SEAT;
//            }
//
//            minioClient.putObject(
//                    PutObjectArgs.builder()
//                            .bucket(bucketName)
//                            .object(fileName)
//                            .stream(img.getInputStream(), img.getSize(), -1)
//                            .contentType(img.getContentType())
//                            .build()
//            );
//        } catch (Exception e) {
//            throw new CustomException("fail.to.upload.file");
//        }
//    }
}
