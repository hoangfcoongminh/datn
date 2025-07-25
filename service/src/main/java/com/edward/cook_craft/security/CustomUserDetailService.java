package com.edward.cook_craft.security;

import com.edward.cook_craft.exception.CustomException;
import com.edward.cook_craft.model.CustomUserDetails;
import com.edward.cook_craft.model.User;
import com.edward.cook_craft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException("user.not.found"));

        return new CustomUserDetails(user);
    }
}
