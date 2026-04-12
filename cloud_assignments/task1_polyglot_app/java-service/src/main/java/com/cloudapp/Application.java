package com.cloudapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

@Document(collection = "tasks")
class Task {
    @Id
    private String id;
    private String title;
    private String description;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

interface TaskRepository extends MongoRepository<Task, String> {}

@RestController
@CrossOrigin(origins = "*")
class CloudController {

    private final List<Task> taskRepository = new ArrayList<>();

    @Autowired
    private RestTemplate restTemplate;

    private final String PYTHON_SERVICE_URL = "http://localhost:8000/analyze";

    @GetMapping("/")
    public String healthCheck() {
        return "Java Orchestrator is Running (Mock Mode)!";
    }

    @GetMapping("/tasks")
    public List<Task> getTasks() {
        return taskRepository;
    }

    @PostMapping("/tasks")
    public Task createTask(@RequestBody Task task) {
        task.setId(java.util.UUID.randomUUID().toString());
        taskRepository.add(task);
        return task;
    }

    @PostMapping("/analyze-task")
    public Map<String, Object> analyzeTask(@RequestBody Task task) {
        // Call Python service for advanced processing
        try {
            return restTemplate.postForObject(PYTHON_SERVICE_URL, task, Map.class);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Python service unavailable at " + PYTHON_SERVICE_URL);
            errorResponse.put("details", e.getMessage());
            return errorResponse;
        }
    }
}
