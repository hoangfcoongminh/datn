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

import static com.edward.cook_craft.constants.Constants.FILE_TYPE_IMAGE;
import static com.edward.cook_craft.constants.Constants.FILE_TYPE_VIDEO;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket-images}")
    private String bucketImage;

    @Value("${minio.bucket-videos}")
    private String bucketVideo;

    @Value("${minio.url}")
    private String url;

    @PostConstruct
    public void initBucket() {
        try {
            boolean foundImages = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketImage).build());
            if (!foundImages) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketImage).build());
            }

            boolean foundVideos = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucketVideo).build()
            );
            if (!foundVideos) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketVideo).build());
            }

        } catch (Exception e) {
            log.error("Error initializing MinIO bucket {}", e.getMessage());
            throw new RuntimeException("Error initializing MinIO bucket", e);
        }
    }

    public String uploadFile(MultipartFile file, String type) {
        try {
            String bucket;
            String returnName = "";
            String filename = file.getOriginalFilename();
            switch (type) {
                case FILE_TYPE_IMAGE:
                    bucket = bucketImage;
                    returnName = url + "/images/" + filename;
                    break;
                case FILE_TYPE_VIDEO:
                    bucket = bucketVideo;
                    returnName = url + "/videos/" + filename;
                    break;
                default:
                    bucket = bucketImage;
            }
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(filename)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            return returnName;

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
                            .bucket(bucketImage)
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
                            .bucket(bucketImage)
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
                        .bucket(bucketImage)
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
//                            .bucket(bucketImage)
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
