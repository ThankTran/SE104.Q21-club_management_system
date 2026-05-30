package com.example.demo.application.dto.response.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HelpAiResponse {
    public String intent;
    public String source;
    public String answer;
    public List<String> suggestions;

}
