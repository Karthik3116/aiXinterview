from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)
    host = "https://hireview-ten.vercel.app"  # Set the base URL

    @task
    def load_login_page(self):
        self.client.get("/sign-in")
