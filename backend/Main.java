import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class Main {
    public static void main(String[] args) {
        boolean match = new BCryptPasswordEncoder().matches("admin123", "$2a$12$/omNixIFmhJc91olowVdqeuc4ya7fCJtTx8Q4znmJ4xJR1j2N3p5u");
        System.out.println("Match? " + match);
    }
}
