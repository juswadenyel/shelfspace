package com.shelfspace.shelfspace.resource;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(Integer id) {
        return resourceRepository.findById(id);
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Integer id, Resource updatedResource) {
        return resourceRepository.findById(id).map(resource -> {
            resource.setTitle(updatedResource.getTitle());
            resource.setType(updatedResource.getType());
            resource.setTotalCopies(updatedResource.getTotalCopies());
            resource.setAvailableCopies(updatedResource.getAvailableCopies());
            return resourceRepository.save(resource);
        }).orElse(null);
    }

    public void deleteResource(Integer id) {
        resourceRepository.deleteById(id);
    }
}